from fastapi import FastAPI, Form, UploadFile, File
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from google.auth.transport import requests
from google.oauth2.credentials import Credentials

from gmail_service import send_email

# ---------------- APP ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- IN-MEMORY USER STORAGE ----------------
# Simple dict to store user credentials (lost on restart)
users = {}

# ---------------- OAUTH CONFIG ----------------
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/auth/callback"

SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/gmail.send",
]


def create_flow():
    return Flow.from_client_config(
        {
            "web": {
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [REDIRECT_URI],
            }
        },
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )


# ---------------- ROUTES ----------------
@app.get("/login")
def login():
    flow = create_flow()
    auth_url, _ = flow.authorization_url(
        prompt="consent",
        access_type="offline"
    )
    app.state.flow = flow
    return RedirectResponse(auth_url)


@app.get("/auth/callback")
def callback(code: str):
    flow = app.state.flow
    flow.fetch_token(code=code)
    creds = flow.credentials

    idinfo = id_token.verify_oauth2_token(
        creds.id_token,
        requests.Request(),
        CLIENT_ID
    )

    user_email = idinfo["email"]
    
    # Store user credentials in memory
    users[user_email] = {
        "email": user_email,
        "access_token": creds.token,
        "refresh_token": creds.refresh_token
    }

    return RedirectResponse(
        url=f"http://localhost:5173/?user_email={user_email}"
    )


@app.post("/send")
def send_email_endpoint(
    user_email: str = Form(...),
    to: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...),
    file: UploadFile = File(None)
):
    try:
        # Get user credentials
        user = users.get(user_email)
        if not user:
            return {"error": "User not authenticated"}, 401
        
        # Build credentials
        creds = Credentials(
            token=user["access_token"],
            refresh_token=user["refresh_token"],
            token_uri="https://oauth2.googleapis.com/token",
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            scopes=SCOPES
        )

        # Send email
        send_email(creds, to, subject, message, file)

        return {"status": "sent", "message": "Email sent successfully!"}
    except Exception as e:
        print(f"ERROR in send_email: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}, 500


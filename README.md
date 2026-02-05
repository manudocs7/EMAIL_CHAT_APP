# Email Chat - Simple Email Sender 📧

A modern, WhatsApp-style email sender application built with React and FastAPI. Send emails directly from your Gmail account with a beautiful chat interface.

## Features ✨

- 🔐 **Google OAuth Authentication** - Secure login with your Gmail account
- 💬 **Chat-Style Interface** - WhatsApp/Telegram-like UI
- 📎 **File Attachments** - Send files with your emails
- ✓✓ **Message Status** - Real-time delivery status
- 📱 **Responsive Design** - Works on mobile and desktop
- 🚀 **No Database Required** - Simple in-memory storage

## Screenshots

![Chat Interface](docs/screenshot.png)

## Tech Stack

### Frontend
- React + Vite
- Modern CSS with animations
- Responsive design

### Backend
- FastAPI (Python)
- Google Gmail API
- OAuth 2.0 authentication

## Prerequisites

- Python 3.8+
- Node.js 16+
- Google Cloud Project with Gmail API enabled
- Gmail account

## Setup Instructions

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Gmail API**
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:8000/auth/callback`
5. Download credentials and note your `CLIENT_ID` and `CLIENT_SECRET`

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env and add your credentials:
# CLIENT_ID=your_client_id_here
# CLIENT_SECRET=your_client_secret_here
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

Backend will run on: http://localhost:8000

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Click **"Login with Google"**
3. Authorize the application
4. Enter recipient email in the header
5. Type your message
6. (Optional) Attach a file using 📎 button
7. Press **Enter** or click **➤** to send
8. Watch your message appear as a chat bubble with status!

## Environment Variables

### Backend (.env)

```env
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
```

## Project Structure

```
email-chat-demo/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── gmail_service.py     # Gmail API integration
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── EmailForm.jsx    # Chat interface
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
└── README.md
```

## API Endpoints

### `GET /login`
Initiates Google OAuth flow

### `GET /auth/callback`
Handles OAuth callback and stores user credentials

### `POST /send`
Sends email via Gmail API

**Parameters:**
- `user_email`: Sender's email (from OAuth)
- `to`: Recipient email
- `subject`: Email subject
- `message`: Email body
- `file`: Optional file attachment

## Troubleshooting

### "User not authenticated" error
- Make sure you've logged in with Google
- Try logging out and logging in again

### OAuth redirect error
- Verify redirect URI in Google Cloud Console matches: `http://localhost:8000/auth/callback`
- Check CLIENT_ID and CLIENT_SECRET in .env file

### Email not sending
- Ensure Gmail API is enabled in Google Cloud Console
- Check that you've authorized the correct Gmail scopes
- Verify your Google account has Gmail access

## Production Deployment

### Environment Variables
Set these in your production environment:
- `CLIENT_ID`
- `CLIENT_SECRET`
- Update `REDIRECT_URI` in `main.py` to your production URL
- Update `allow_origins` in CORS middleware

### Build Frontend
```bash
cd frontend
npm run build
```

### Run Backend in Production
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to version control
- Keep your `CLIENT_SECRET` secure
- Use HTTPS in production
- Implement rate limiting for production use
- Add proper error logging

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first...

## Support

For issues or questions, please open a GitHub issue...

---

Made with ❤️ using React, FastAPI, and Gmail API 

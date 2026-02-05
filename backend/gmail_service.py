from googleapiclient.discovery import build
from email.message import EmailMessage
import base64
import mimetypes


def send_email(creds, to, subject, body, file=None):
    """Send email via Gmail API"""
    service = build("gmail", "v1", credentials=creds)

    message = EmailMessage()
    message.set_content(body)
    message["To"] = to
    message["Subject"] = subject

    # Attach file if provided
    if file:
        file_content = file.file.read()
        mime_type, _ = mimetypes.guess_type(file.filename)
        if mime_type is None:
            mime_type = "application/octet-stream"

        main_type, sub_type = mime_type.split("/", 1)

        message.add_attachment(
            file_content,
            maintype=main_type,
            subtype=sub_type,
            filename=file.filename
        )

    # Encode and send
    encoded = base64.urlsafe_b64encode(message.as_bytes()).decode()

    service.users().messages().send(
        userId="me",
        body={"raw": encoded}
    ).execute()

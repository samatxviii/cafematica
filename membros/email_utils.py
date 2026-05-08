from __future__ import annotations

import os
import smtplib
from email.message import EmailMessage
from flask import current_app


def send_email(to: str, subject: str, body: str) -> None:
    host = os.getenv("SMTP_HOST", "").strip()
    port = int(os.getenv("SMTP_PORT", "587") or 587)
    user = os.getenv("SMTP_USER", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()
    mail_from = os.getenv("MAIL_FROM", "contato@cafematica.com.br").strip()

    if not host:
        current_app.logger.warning("SMTP não configurado. E-mail simulado.")
        current_app.logger.warning("Para: %s\nAssunto: %s\n%s", to, subject, body)
        return

    msg = EmailMessage()
    msg["From"] = mail_from
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)

    with smtplib.SMTP(host, port) as smtp:
        smtp.starttls()
        if user and password:
            smtp.login(user, password)
        smtp.send_message(msg)

from __future__ import annotations

import hashlib
import hmac
import secrets
from functools import wraps

from flask import abort, flash, g, redirect, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash


def hash_password(password: str) -> str:
    return generate_password_hash(password, method="scrypt")


def verify_password(password_hash: str, password: str) -> bool:
    return check_password_hash(password_hash, password)


def new_csrf_token() -> str:
    token = secrets.token_urlsafe(32)
    session["_csrf_token"] = token
    return token


def csrf_token() -> str:
    return session.get("_csrf_token") or new_csrf_token()


def validate_csrf() -> None:
    sent = request.form.get("_csrf_token", "")
    saved = session.get("_csrf_token", "")
    if not sent or not saved or not hmac.compare_digest(sent, saved):
        abort(400, description="Token CSRF inválido.")


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("user_id"):
            flash("Faça login para continuar.", "warning")
            return redirect(url_for("login", next=request.path))
        return view(*args, **kwargs)
    return wrapped


def admin_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("user_id"):
            flash("Faça login para continuar.", "warning")
            return redirect(url_for("login", next=request.path))
        if not getattr(g, "user", None) or not g.user["is_admin"]:
            abort(403)
        return view(*args, **kwargs)
    return wrapped


def token_hash(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

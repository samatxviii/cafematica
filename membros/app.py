from __future__ import annotations

import os
import secrets
from datetime import date, datetime, timedelta
from urllib.parse import urlparse

from dotenv import load_dotenv
from flask import (
    Flask, abort, flash, g, jsonify, redirect, render_template, request,
    send_file, session, url_for
)

from db import close_db, execute, init_db, query
from email_utils import send_email
from pdf_tools import personalize_pdf
from security import (
    admin_required, csrf_token, hash_password, login_required,
    token_hash, validate_csrf, verify_password
)

load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__, instance_relative_config=True)
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "troque-esta-chave-em-producao"),
        DATABASE=os.path.join(app.root_path, os.getenv("DATABASE_PATH", "instance/cafematica.db")),
        APP_BASE_URL=os.getenv("APP_BASE_URL", "http://127.0.0.1:5000"),
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    )
    app.teardown_appcontext(close_db)

    @app.context_processor
    def inject_helpers():
        return {"csrf_token": csrf_token, "current_year": datetime.now().year}

    @app.before_request
    def load_logged_in_user():
        user_id = session.get("user_id")
        g.user = None
        if user_id:
            g.user = query("SELECT * FROM users WHERE id = ?", (user_id,), one=True)

    @app.route("/")
    def home():
        return render_template("home.html")

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            validate_csrf()
            email = request.form.get("email", "").strip().lower()
            password = request.form.get("password", "")
            user = query("SELECT * FROM users WHERE email = ?", (email,), one=True)
            if user and verify_password(user["password_hash"], password):
                session.clear()
                session["user_id"] = user["id"]
                next_url = request.args.get("next")
                if next_url and urlparse(next_url).netloc == "":
                    return redirect(next_url)
                return redirect(url_for("admin_dashboard" if user["is_admin"] else "student_dashboard"))
            flash("E-mail ou senha inválidos.", "danger")
        return render_template("login.html")

    @app.route("/logout", methods=["POST"])
    def logout():
        validate_csrf()
        session.clear()
        flash("Você saiu da sua conta.", "info")
        return redirect(url_for("login"))

    @app.route("/forgot-password", methods=["GET", "POST"])
    def forgot_password():
        if request.method == "POST":
            validate_csrf()
            email = request.form.get("email", "").strip().lower()
            user = query("SELECT * FROM users WHERE email = ?", (email,), one=True)
            if user:
                raw_token = secrets.token_urlsafe(32)
                expires_at = (datetime.now() + timedelta(hours=2)).isoformat(timespec="seconds")
                execute(
                    "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
                    (user["id"], token_hash(raw_token), expires_at),
                )
                link = url_for("reset_password", token=raw_token, _external=True)
                send_email(
                    user["email"],
                    "Redefinição de senha — Cafemática",
                    f"Olá, {user['full_name']}.\n\nUse este link para redefinir sua senha em até 2 horas:\n{link}\n\nSe você não pediu isso, ignore esta mensagem.",
                )
            flash("Se o e-mail estiver cadastrado, enviaremos as instruções.", "success")
        return render_template("forgot_password.html")

    @app.route("/reset-password/<token>", methods=["GET", "POST"])
    def reset_password(token):
        record = query(
            "SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL",
            (token_hash(token),), one=True
        )
        if not record:
            abort(404)
        if datetime.fromisoformat(record["expires_at"]) < datetime.now():
            flash("Este link expirou. Solicite outro.", "danger")
            return redirect(url_for("forgot_password"))
        if request.method == "POST":
            validate_csrf()
            password = request.form.get("password", "")
            if len(password) < 8:
                flash("A senha precisa ter pelo menos 8 caracteres.", "warning")
                return render_template("reset_password.html", token=token)
            execute("UPDATE users SET password_hash = ? WHERE id = ?", (hash_password(password), record["user_id"]))
            execute("UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?", (record["id"],))
            flash("Senha alterada com sucesso. Faça login.", "success")
            return redirect(url_for("login"))
        return render_template("reset_password.html", token=token)

    def require_course_access(course_id: int):
        enrollment = query(
            "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'active'",
            (g.user["id"], course_id), one=True
        )
        if not enrollment:
            abort(403)
        if enrollment["expires_at"] and datetime.fromisoformat(enrollment["expires_at"]) < datetime.now():
            abort(403)
        return enrollment

    @app.route("/membros")
    @login_required
    def student_dashboard():
        if g.user["is_admin"]:
            return redirect(url_for("admin_dashboard"))

        enrollments = query("""
            SELECT e.*, c.title, c.slug, c.thumbnail_url, c.description, c.category_id,
                   cat.name AS category_name,
                   clp.lesson_id AS last_lesson_id, clp.seconds AS last_seconds,
                   l.title AS last_lesson_title
            FROM enrollments e
            JOIN courses c ON c.id = e.course_id
            LEFT JOIN categories cat ON cat.id = c.category_id
            LEFT JOIN course_last_position clp ON clp.user_id = e.user_id AND clp.course_id = e.course_id
            LEFT JOIN lessons l ON l.id = clp.lesson_id
            WHERE e.user_id = ? AND e.status = 'active'
            ORDER BY e.purchased_at DESC
        """, (g.user["id"],))

        renewal_notices = []
        today = date.today()
        for e in enrollments:
            if e["expires_at"]:
                expires = datetime.fromisoformat(e["expires_at"]).date()
                days_left = (expires - today).days
                notice_key = f"renewal-{e['course_id']}-{expires.isoformat()}"
                already = query(
                    "SELECT 1 FROM daily_notices WHERE user_id = ? AND notice_key = ? AND shown_date = ?",
                    (g.user["id"], notice_key, today.isoformat()), one=True
                )
                if 0 <= days_left <= 30 and not already:
                    renewal_notices.append({"course": e, "days_left": days_left, "notice_key": notice_key})

        purchased_ids = [str(e["course_id"]) for e in enrollments] or ["0"]
        user_categories = [str(e["category_id"]) for e in enrollments if e["category_id"]]

        placeholders_purchased = ",".join("?" for _ in purchased_ids)
        params = purchased_ids[:]
        category_clause = ""
        if user_categories:
            category_clause = "OR r.source_category_id IN (" + ",".join("?" for _ in user_categories) + ")"
            params += user_categories

        recommendations = query(f"""
            SELECT DISTINCT c.*
            FROM recommendations r
            JOIN courses c ON c.id = r.recommended_course_id
            WHERE c.is_active = 1
              AND c.id NOT IN ({placeholders_purchased})
              AND (r.source_category_id IS NULL {category_clause})
            ORDER BY r.position ASC, c.created_at DESC
            LIMIT 8
        """, tuple(params))

        if not recommendations:
            recommendations = query(f"""
                SELECT * FROM courses
                WHERE is_active = 1 AND id NOT IN ({placeholders_purchased})
                ORDER BY created_at DESC LIMIT 8
            """, tuple(purchased_ids))

        return render_template(
            "student/dashboard.html",
            enrollments=enrollments,
            recommendations=recommendations,
            renewal_notices=renewal_notices,
        )

    @app.route("/membros/notice/dismiss", methods=["POST"])
    @login_required
    def dismiss_notice():
        validate_csrf()
        notice_key = request.form.get("notice_key", "")
        execute(
            "INSERT OR IGNORE INTO daily_notices (user_id, notice_key, shown_date) VALUES (?, ?, ?)",
            (g.user["id"], notice_key, date.today().isoformat())
        )
        return redirect(url_for("student_dashboard"))

    @app.route("/curso/<slug>")
    @login_required
    def course_page(slug):
        course = query("SELECT * FROM courses WHERE slug = ?", (slug,), one=True)
        if not course:
            abort(404)
        require_course_access(course["id"])
        lessons = query("SELECT * FROM lessons WHERE course_id = ? ORDER BY position ASC, id ASC", (course["id"],))
        progress_rows = query("SELECT * FROM lesson_progress WHERE user_id = ? AND course_id = ?", (g.user["id"], course["id"]))
        completed_ids = {p["lesson_id"] for p in progress_rows if p["completed"]}
        percent = round((len(completed_ids) / len(lessons)) * 100) if lessons else 0
        last_pos = query("""
            SELECT clp.*, l.title AS lesson_title
            FROM course_last_position clp
            JOIN lessons l ON l.id = clp.lesson_id
            WHERE clp.user_id = ? AND clp.course_id = ?
        """, (g.user["id"], course["id"]), one=True)
        ebooks = query("SELECT * FROM ebooks WHERE course_id = ?", (course["id"],))
        return render_template("student/course.html", course=course, lessons=lessons, percent=percent, last_pos=last_pos, ebooks=ebooks, completed_ids=completed_ids)

    @app.route("/aula/<int:lesson_id>", methods=["GET", "POST"])
    @login_required
    def lesson_page(lesson_id):
        lesson = query("SELECT * FROM lessons WHERE id = ?", (lesson_id,), one=True)
        if not lesson:
            abort(404)
        course = query("SELECT * FROM courses WHERE id = ?", (lesson["course_id"],), one=True)
        require_course_access(course["id"])

        if request.method == "POST":
            validate_csrf()
            action = request.form.get("action")
            if action == "comment":
                body = request.form.get("body", "").strip()
                parent_id = request.form.get("parent_id") or None
                if body:
                    execute(
                        "INSERT INTO comments (lesson_id, user_id, parent_id, body) VALUES (?, ?, ?, ?)",
                        (lesson_id, g.user["id"], parent_id, body)
                    )
                    flash("Comentário publicado.", "success")
            elif action == "rating":
                stars = int(request.form.get("stars", "5"))
                if 1 <= stars <= 5:
                    execute("""
                        INSERT INTO lesson_ratings (user_id, lesson_id, stars)
                        VALUES (?, ?, ?)
                        ON CONFLICT(user_id, lesson_id)
                        DO UPDATE SET stars = excluded.stars, updated_at = CURRENT_TIMESTAMP
                    """, (g.user["id"], lesson_id, stars))
                    flash("Avaliação registrada.", "success")
            return redirect(url_for("lesson_page", lesson_id=lesson_id))

        comments = query("""
            SELECT c.*, u.full_name,
                   (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.id) AS likes
            FROM comments c
            JOIN users u ON u.id = c.user_id
            WHERE c.lesson_id = ?
            ORDER BY c.created_at ASC
        """, (lesson_id,))
        ratings = query("SELECT AVG(stars) AS avg_stars, COUNT(*) AS total FROM lesson_ratings WHERE lesson_id = ?", (lesson_id,), one=True)
        current_progress = query("SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?", (g.user["id"], lesson_id), one=True)
        return render_template("student/lesson.html", lesson=lesson, course=course, comments=comments, ratings=ratings, current_progress=current_progress)

    @app.route("/api/progress", methods=["POST"])
    @login_required
    def api_progress():
        data = request.get_json(force=True)
        lesson_id = int(data.get("lesson_id"))
        seconds = max(0, int(data.get("seconds", 0)))
        completed = 1 if data.get("completed") else 0
        lesson = query("SELECT * FROM lessons WHERE id = ?", (lesson_id,), one=True)
        if not lesson:
            abort(404)
        require_course_access(lesson["course_id"])

        execute("""
            INSERT INTO lesson_progress (user_id, course_id, lesson_id, seconds, completed, updated_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, lesson_id)
            DO UPDATE SET seconds = excluded.seconds, completed = MAX(lesson_progress.completed, excluded.completed), updated_at = CURRENT_TIMESTAMP
        """, (g.user["id"], lesson["course_id"], lesson_id, seconds, completed))

        execute("""
            INSERT INTO course_last_position (user_id, course_id, lesson_id, seconds, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, course_id)
            DO UPDATE SET lesson_id = excluded.lesson_id, seconds = excluded.seconds, updated_at = CURRENT_TIMESTAMP
        """, (g.user["id"], lesson["course_id"], lesson_id, seconds))

        return jsonify({"ok": True})

    @app.route("/comentario/<int:comment_id>/curtir", methods=["POST"])
    @login_required
    def like_comment(comment_id):
        validate_csrf()
        comment = query("SELECT * FROM comments WHERE id = ?", (comment_id,), one=True)
        if not comment:
            abort(404)
        lesson = query("SELECT * FROM lessons WHERE id = ?", (comment["lesson_id"],), one=True)
        require_course_access(lesson["course_id"])
        execute("INSERT OR IGNORE INTO comment_likes (comment_id, user_id) VALUES (?, ?)", (comment_id, g.user["id"]))
        return redirect(url_for("lesson_page", lesson_id=comment["lesson_id"]))

    @app.route("/ebook/<int:ebook_id>/baixar")
    @login_required
    def download_ebook(ebook_id):
        ebook = query("SELECT * FROM ebooks WHERE id = ?", (ebook_id,), one=True)
        if not ebook:
            abort(404)
        require_course_access(ebook["course_id"])
        user_dir = os.path.join(os.path.dirname(__file__), "instance", "personalized_ebooks")
        os.makedirs(user_dir, exist_ok=True)
        output_pdf = os.path.join(user_dir, f"ebook_{ebook_id}_user_{g.user['id']}.pdf")
        personalize_pdf(ebook["source_pdf_path"], output_pdf, g.user["full_name"], g.user["cpf"] or "")
        return send_file(output_pdf, as_attachment=True, download_name=f"{ebook['title']}-personalizado.pdf")

    @app.route("/faq")
    @login_required
    def faq():
        faqs = query("SELECT * FROM faqs WHERE is_active = 1 ORDER BY position ASC")
        return render_template("student/faq.html", faqs=faqs)

    @app.route("/tickets", methods=["GET", "POST"])
    @login_required
    def tickets():
        if request.method == "POST":
            validate_csrf()
            title = request.form.get("title", "").strip()
            message = request.form.get("message", "").strip()
            page_url = request.form.get("page_url", "").strip()
            if title and message:
                ticket_id = execute(
                    "INSERT INTO tickets (user_id, title, page_url) VALUES (?, ?, ?)",
                    (g.user["id"], title, page_url)
                )
                execute(
                    "INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin_message) VALUES (?, ?, ?, ?)",
                    (ticket_id, g.user["id"], message, 1 if g.user["is_admin"] else 0)
                )
                subject = f"{g.user['full_name']} — {title}"
                body = (
                    f"Novo ticket aberto no Cafemática.\n\n"
                    f"Aluno: {g.user['full_name']}\n"
                    f"E-mail: {g.user['email']}\n"
                    f"Telefone: {g.user['phone'] or 'não informado'}\n"
                    f"CPF: {g.user['cpf'] or 'não informado'}\n"
                    f"Página: {page_url or 'não informada'}\n\n"
                    f"Mensagem:\n{message}\n"
                )
                send_email("contato@cafematica.com.br", subject, body)
                flash("Ticket aberto com sucesso.", "success")
                return redirect(url_for("ticket_detail", ticket_id=ticket_id))
        my_tickets = query("SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC", (g.user["id"],))
        return render_template("student/tickets.html", tickets=my_tickets)

    @app.route("/tickets/<int:ticket_id>", methods=["GET", "POST"])
    @login_required
    def ticket_detail(ticket_id):
        ticket = query("""
            SELECT t.*, u.full_name, u.email, u.phone, u.cpf
            FROM tickets t JOIN users u ON u.id = t.user_id
            WHERE t.id = ?
        """, (ticket_id,), one=True)
        if not ticket:
            abort(404)
        if not g.user["is_admin"] and ticket["user_id"] != g.user["id"]:
            abort(403)

        if request.method == "POST":
            validate_csrf()
            action = request.form.get("action")
            if action == "reply":
                msg = request.form.get("message", "").strip()
                if msg:
                    execute(
                        "INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin_message) VALUES (?, ?, ?, ?)",
                        (ticket_id, g.user["id"], msg, 1 if g.user["is_admin"] else 0)
                    )
                    execute("UPDATE tickets SET status = 'open' WHERE id = ?", (ticket_id,))
            elif action == "close":
                execute("UPDATE tickets SET status = 'closed', closed_at = CURRENT_TIMESTAMP WHERE id = ?", (ticket_id,))
            flash("Ticket atualizado.", "success")
            return redirect(url_for("ticket_detail", ticket_id=ticket_id))

        messages = query("""
            SELECT tm.*, u.full_name
            FROM ticket_messages tm JOIN users u ON u.id = tm.user_id
            WHERE tm.ticket_id = ?
            ORDER BY tm.created_at ASC
        """, (ticket_id,))
        return render_template("student/ticket_detail.html", ticket=ticket, messages=messages)

    @app.route("/admin")
    @admin_required
    def admin_dashboard():
        counts = {
            "students": query("SELECT COUNT(*) AS n FROM users WHERE is_admin = 0", one=True)["n"],
            "courses": query("SELECT COUNT(*) AS n FROM courses", one=True)["n"],
            "tickets": query("SELECT COUNT(*) AS n FROM tickets WHERE status <> 'closed'", one=True)["n"],
            "expiring": query("""
                SELECT COUNT(*) AS n FROM enrollments
                WHERE status = 'active' AND expires_at IS NOT NULL
                  AND date(expires_at) BETWEEN date('now') AND date('now', '+30 days')
            """, one=True)["n"],
        }
        recent_tickets = query("""
            SELECT t.*, u.full_name FROM tickets t
            JOIN users u ON u.id = t.user_id
            ORDER BY t.created_at DESC LIMIT 8
        """)
        return render_template("admin/dashboard.html", counts=counts, recent_tickets=recent_tickets)

    @app.route("/admin/alunos")
    @admin_required
    def admin_students():
        course_id = request.args.get("course_id", "")
        expiry = request.args.get("expiry", "")
        params = []
        where = ["u.is_admin = 0"]
        joins = ""
        if course_id:
            joins += " JOIN enrollments efilter ON efilter.user_id = u.id "
            where.append("efilter.course_id = ?")
            params.append(course_id)
        if expiry == "30":
            joins += " JOIN enrollments eexp ON eexp.user_id = u.id "
            where.append("date(eexp.expires_at) BETWEEN date('now') AND date('now', '+30 days')")

        students = query(f"""
            SELECT DISTINCT u.*,
                (SELECT COUNT(*) FROM tickets t WHERE t.user_id = u.id) AS ticket_count,
                (SELECT COUNT(*) FROM enrollments e WHERE e.user_id = u.id) AS course_count
            FROM users u {joins}
            WHERE {" AND ".join(where)}
            ORDER BY u.full_name ASC
        """, tuple(params))
        courses = query("SELECT * FROM courses ORDER BY title")
        return render_template("admin/students.html", students=students, courses=courses, selected_course=course_id, expiry=expiry)

    @app.route("/admin/alunos/novo", methods=["GET", "POST"])
    @admin_required
    def admin_student_new():
        if request.method == "POST":
            validate_csrf()
            full_name = request.form.get("full_name", "").strip()
            email = request.form.get("email", "").strip().lower()
            phone = request.form.get("phone", "").strip()
            cpf = request.form.get("cpf", "").strip()
            password = request.form.get("password", "Aluno@12345")
            if full_name and email and len(password) >= 8:
                execute("""
                    INSERT INTO users (full_name, email, phone, cpf, password_hash, is_admin)
                    VALUES (?, ?, ?, ?, ?, 0)
                """, (full_name, email, phone, cpf, hash_password(password)))
                flash("Aluno cadastrado.", "success")
                return redirect(url_for("admin_students"))
        return render_template("admin/student_form.html")

    @app.route("/admin/alunos/<int:user_id>", methods=["GET", "POST"])
    @admin_required
    def admin_student_detail(user_id):
        student = query("SELECT * FROM users WHERE id = ? AND is_admin = 0", (user_id,), one=True)
        if not student:
            abort(404)
        if request.method == "POST":
            validate_csrf()
            action = request.form.get("action")
            if action == "update":
                execute("""
                    UPDATE users SET full_name = ?, email = ?, phone = ?, cpf = ?
                    WHERE id = ?
                """, (
                    request.form.get("full_name", "").strip(),
                    request.form.get("email", "").strip().lower(),
                    request.form.get("phone", "").strip(),
                    request.form.get("cpf", "").strip(),
                    user_id
                ))
                flash("Aluno atualizado.", "success")
            elif action == "password":
                password = request.form.get("password", "")
                if len(password) >= 8:
                    execute("UPDATE users SET password_hash = ? WHERE id = ?", (hash_password(password), user_id))
                    flash("Senha alterada.", "success")
            elif action == "enroll":
                course_id = request.form.get("course_id")
                expires_at = request.form.get("expires_at") or None
                execute("""
                    INSERT INTO enrollments (user_id, course_id, expires_at, status)
                    VALUES (?, ?, ?, 'active')
                    ON CONFLICT(user_id, course_id)
                    DO UPDATE SET expires_at = excluded.expires_at, status = 'active'
                """, (user_id, course_id, expires_at))
                flash("Matrícula liberada/atualizada.", "success")
            return redirect(url_for("admin_student_detail", user_id=user_id))

        enrollments = query("""
            SELECT e.*, c.title FROM enrollments e
            JOIN courses c ON c.id = e.course_id
            WHERE e.user_id = ?
            ORDER BY e.purchased_at DESC
        """, (user_id,))
        tickets_ = query("SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        progress = query("""
            SELECT c.title AS course_title, l.title AS lesson_title, lp.seconds, lp.completed, lp.updated_at
            FROM lesson_progress lp
            JOIN courses c ON c.id = lp.course_id
            JOIN lessons l ON l.id = lp.lesson_id
            WHERE lp.user_id = ?
            ORDER BY lp.updated_at DESC
        """, (user_id,))
        courses = query("SELECT * FROM courses ORDER BY title")
        return render_template("admin/student_detail.html", student=student, enrollments=enrollments, tickets=tickets_, progress=progress, courses=courses)

    @app.route("/admin/categorias", methods=["GET", "POST"])
    @admin_required
    def admin_categories():
        if request.method == "POST":
            validate_csrf()
            name = request.form.get("name", "").strip()
            if name:
                execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (name,))
                flash("Categoria salva.", "success")
            return redirect(url_for("admin_categories"))
        categories = query("""
            SELECT cat.*, (SELECT COUNT(*) FROM courses c WHERE c.category_id = cat.id) AS course_count
            FROM categories cat ORDER BY name
        """)
        return render_template("admin/categories.html", categories=categories)

    @app.route("/admin/categorias/<int:category_id>/excluir", methods=["POST"])
    @admin_required
    def admin_category_delete(category_id):
        validate_csrf()
        execute("UPDATE courses SET category_id = NULL WHERE category_id = ?", (category_id,))
        execute("DELETE FROM categories WHERE id = ?", (category_id,))
        flash("Categoria excluída. Cursos e alunos foram preservados.", "success")
        return redirect(url_for("admin_categories"))

    @app.route("/admin/cursos")
    @admin_required
    def admin_courses():
        courses = query("""
            SELECT c.*, cat.name AS category_name
            FROM courses c LEFT JOIN categories cat ON cat.id = c.category_id
            ORDER BY c.created_at DESC
        """)
        return render_template("admin/courses.html", courses=courses)

    @app.route("/admin/cursos/novo", methods=["GET", "POST"])
    @admin_required
    def admin_course_new():
        categories = query("SELECT * FROM categories ORDER BY name")
        if request.method == "POST":
            validate_csrf()
            execute("""
                INSERT INTO courses (title, slug, description, category_id, thumbnail_url, price_cents, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                request.form.get("title", "").strip(),
                request.form.get("slug", "").strip(),
                request.form.get("description", "").strip(),
                request.form.get("category_id") or None,
                request.form.get("thumbnail_url", "").strip(),
                int(float(request.form.get("price", "0").replace(",", ".")) * 100),
                1 if request.form.get("is_active") else 0,
            ))
            flash("Curso criado.", "success")
            return redirect(url_for("admin_courses"))
        return render_template("admin/course_form.html", course=None, categories=categories)

    @app.route("/admin/cursos/<int:course_id>", methods=["GET", "POST"])
    @admin_required
    def admin_course_edit(course_id):
        course = query("SELECT * FROM courses WHERE id = ?", (course_id,), one=True)
        if not course:
            abort(404)
        categories = query("SELECT * FROM categories ORDER BY name")
        if request.method == "POST":
            validate_csrf()
            action = request.form.get("action")
            if action == "course":
                execute("""
                    UPDATE courses SET title = ?, slug = ?, description = ?, category_id = ?, thumbnail_url = ?, price_cents = ?, is_active = ?
                    WHERE id = ?
                """, (
                    request.form.get("title", "").strip(),
                    request.form.get("slug", "").strip(),
                    request.form.get("description", "").strip(),
                    request.form.get("category_id") or None,
                    request.form.get("thumbnail_url", "").strip(),
                    int(float(request.form.get("price", "0").replace(",", ".")) * 100),
                    1 if request.form.get("is_active") else 0,
                    course_id,
                ))
                flash("Curso atualizado.", "success")
            elif action == "lesson":
                execute("""
                    INSERT INTO lessons (course_id, title, youtube_id, content, position)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    course_id,
                    request.form.get("lesson_title", "").strip(),
                    request.form.get("youtube_id", "").strip(),
                    request.form.get("content", "").strip(),
                    int(request.form.get("position", "0") or 0),
                ))
                flash("Aula adicionada.", "success")
            elif action == "ebook":
                execute("INSERT INTO ebooks (course_id, title, source_pdf_path) VALUES (?, ?, ?)", (
                    course_id,
                    request.form.get("ebook_title", "").strip(),
                    request.form.get("source_pdf_path", "").strip(),
                ))
                flash("E-book vinculado.", "success")
            return redirect(url_for("admin_course_edit", course_id=course_id))
        lessons = query("SELECT * FROM lessons WHERE course_id = ? ORDER BY position", (course_id,))
        ebooks = query("SELECT * FROM ebooks WHERE course_id = ?", (course_id,))
        return render_template("admin/course_form.html", course=course, categories=categories, lessons=lessons, ebooks=ebooks)

    @app.route("/admin/recomendacoes", methods=["GET", "POST"])
    @admin_required
    def admin_recommendations():
        if request.method == "POST":
            validate_csrf()
            execute("""
                INSERT INTO recommendations (source_category_id, recommended_course_id, position)
                VALUES (?, ?, ?)
            """, (
                request.form.get("source_category_id") or None,
                request.form.get("recommended_course_id"),
                int(request.form.get("position", "0") or 0),
            ))
            flash("Recomendação adicionada.", "success")
            return redirect(url_for("admin_recommendations"))
        recs = query("""
            SELECT r.*, c.title AS course_title, cat.name AS category_name
            FROM recommendations r
            JOIN courses c ON c.id = r.recommended_course_id
            LEFT JOIN categories cat ON cat.id = r.source_category_id
            ORDER BY r.position
        """)
        courses = query("SELECT * FROM courses ORDER BY title")
        categories = query("SELECT * FROM categories ORDER BY name")
        return render_template("admin/recommendations.html", recs=recs, courses=courses, categories=categories)

    @app.route("/admin/tickets")
    @admin_required
    def admin_tickets():
        tickets_ = query("""
            SELECT t.*, u.full_name, u.email
            FROM tickets t JOIN users u ON u.id = t.user_id
            ORDER BY CASE WHEN t.status='open' THEN 0 ELSE 1 END, t.created_at DESC
        """)
        return render_template("admin/tickets.html", tickets=tickets_)

    return app


app = create_app()

if __name__ == "__main__":
    with app.app_context():
        init_db(app)
    app.run(debug=True)

from __future__ import annotations

import os
from datetime import datetime, timedelta

from app import create_app
from db import execute, init_db, query
from pdf_tools import make_sample_pdf
from security import hash_password

app = create_app()

with app.app_context():
    init_db(app)

    if not query("SELECT 1 FROM users WHERE email = ?", ("admin@cafematica.com.br",), one=True):
        execute("""
            INSERT INTO users (full_name, email, phone, cpf, password_hash, is_admin)
            VALUES (?, ?, ?, ?, ?, 1)
        """, ("Prof. Fernando", "admin@cafematica.com.br", "+5567999975834", "", hash_password("Admin@12345")))

    if not query("SELECT 1 FROM users WHERE email = ?", ("aluno@exemplo.com",), one=True):
        execute("""
            INSERT INTO users (full_name, email, phone, cpf, password_hash, is_admin)
            VALUES (?, ?, ?, ?, ?, 0)
        """, ("Aluno Exemplo", "aluno@exemplo.com", "+5567999999999", "000.000.000-00", hash_password("Aluno@12345")))

    for name in ["Mentoria em LaTeX", "Matemática Básica", "Preparação para ENEM", "Preparação para Concurso"]:
        execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (name,))

    latex_cat = query("SELECT id FROM categories WHERE name = ?", ("Mentoria em LaTeX",), one=True)["id"]
    enem_cat = query("SELECT id FROM categories WHERE name = ?", ("Preparação para ENEM",), one=True)["id"]

    if not query("SELECT 1 FROM courses WHERE slug = ?", ("curso-de-latex",), one=True):
        execute("""
            INSERT INTO courses (title, slug, description, category_id, thumbnail_url, price_cents)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("O Curso de LaTeX", "curso-de-latex", "Aprenda LaTeX de forma prática, organizada e profissional.", latex_cat, "https://placehold.co/480x270?text=LaTeX", 19700))

    if not query("SELECT 1 FROM courses WHERE slug = ?", ("matematica-enem",), one=True):
        execute("""
            INSERT INTO courses (title, slug, description, category_id, thumbnail_url, price_cents)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("Matemática para o ENEM", "matematica-enem", "Preparação objetiva para Matemática do ENEM.", enem_cat, "https://placehold.co/480x270?text=ENEM", 49700))

    course = query("SELECT * FROM courses WHERE slug = ?", ("curso-de-latex",), one=True)
    if not query("SELECT 1 FROM lessons WHERE course_id = ?", (course["id"],), one=True):
        execute("INSERT INTO lessons (course_id, title, youtube_id, content, position) VALUES (?, ?, ?, ?, ?)",
                (course["id"], "Boas-vindas ao curso", "dQw4w9WgXcQ", "Nesta aula você entende a organização do curso.", 1))
        execute("INSERT INTO lessons (course_id, title, youtube_id, content, position) VALUES (?, ?, ?, ?, ?)",
                (course["id"], "Como instalar o LaTeX", "dQw4w9WgXcQ", "Substitua o ID do YouTube pelo vídeo real.", 2))

    pdf_path = os.path.join(os.path.dirname(__file__), "uploads", "ebooks", "ebook_exemplo.pdf")
    if not os.path.exists(pdf_path):
        make_sample_pdf(pdf_path, "E-book de exemplo do Cafemática")
    if not query("SELECT 1 FROM ebooks WHERE course_id = ?", (course["id"],), one=True):
        execute("INSERT INTO ebooks (course_id, title, source_pdf_path) VALUES (?, ?, ?)",
                (course["id"], "E-book de exemplo em LaTeX", pdf_path))

    aluno = query("SELECT * FROM users WHERE email = ?", ("aluno@exemplo.com",), one=True)
    expires = (datetime.now() + timedelta(days=25)).isoformat(timespec="seconds")
    execute("""
        INSERT INTO enrollments (user_id, course_id, expires_at, status)
        VALUES (?, ?, ?, 'active')
        ON CONFLICT(user_id, course_id) DO UPDATE SET expires_at = excluded.expires_at, status = 'active'
    """, (aluno["id"], course["id"], expires))

    enem_course = query("SELECT * FROM courses WHERE slug = ?", ("matematica-enem",), one=True)
    if not query("SELECT 1 FROM recommendations WHERE source_category_id = ? AND recommended_course_id = ?", (latex_cat, enem_course["id"]), one=True):
        execute("INSERT INTO recommendations (source_category_id, recommended_course_id, position) VALUES (?, ?, ?)",
                (latex_cat, enem_course["id"], 1))

    if not query("SELECT 1 FROM faqs WHERE question = ?", ("Como recupero minha senha?",), one=True):
        execute("INSERT INTO faqs (question, answer, position) VALUES (?, ?, ?)",
                ("Como recupero minha senha?", "Clique em 'Esqueci minha senha' na tela de login e siga as instruções.", 1))
    if not query("SELECT 1 FROM faqs WHERE question = ?", ("Meu acesso venceu. O que faço?",), one=True):
        execute("INSERT INTO faqs (question, answer, position) VALUES (?, ?, ?)",
                ("Meu acesso venceu. O que faço?", "Acesse sua área de membros e clique na opção de renovação, ou abra um ticket.", 2))

print("Banco populado com dados de exemplo.")

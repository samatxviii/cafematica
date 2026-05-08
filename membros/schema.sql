PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    phone TEXT,
    cpf TEXT,
    password_hash TEXT NOT NULL,
    is_admin INTEGER NOT NULL DEFAULT 0,
    photo_url TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id INTEGER,
    thumbnail_url TEXT,
    price_cents INTEGER DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    youtube_id TEXT,
    content TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    is_preview INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ebooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    source_pdf_path TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    purchased_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    notes TEXT,
    UNIQUE(user_id, course_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    seconds INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_last_position (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    seconds INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lesson_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    stars INTEGER NOT NULL CHECK(stars BETWEEN 1 AND 5),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    parent_id INTEGER,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id),
    FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    page_url TEXT,
    screenshot_path TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ticket_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    is_admin_message INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_category_id INTEGER,
    recommended_course_id INTEGER NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(source_category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY(recommended_course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    notice_key TEXT NOT NULL,
    shown_date TEXT NOT NULL,
    dismissed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, notice_key, shown_date),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_position ON lessons(course_id, position);
CREATE INDEX IF NOT EXISTS idx_comments_lesson ON comments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_status ON tickets(user_id, status);

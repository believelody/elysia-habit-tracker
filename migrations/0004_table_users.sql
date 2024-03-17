CREATE TABLE users
(
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    google_id TEXT UNIQUE
);

CREATE TABLE sessions
(
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
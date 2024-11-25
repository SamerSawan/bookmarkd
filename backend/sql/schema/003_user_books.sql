-- +goose Up
CREATE TABLE user_books (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    isbn TEXT NOT NULL REFERENCES books(isbn) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('To Be Read', 'Currently Reading', 'Read')),
    progress INTEGER DEFAULT 0,
    started_at DATE,
    finished_at DATE,
    lent_to TEXT,
    updated_at TIMESTAMP,
    UNIQUE (user_id, isbn)
);

-- +goose Down
DROP TABLE user_books;
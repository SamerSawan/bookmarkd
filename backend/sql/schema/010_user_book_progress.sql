-- +goose Up
CREATE TABLE user_book_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_book_id UUID NOT NULL REFERENCES user_books(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- +goose Down
DROP TABLE user_book_progress;

-- +goose Up
CREATE TABLE favourites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    isbn TEXT NOT NULL REFERENCES books(isbn) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE (user_id, isbn)
);

-- +goose Down
DROP TABLE favourites;

-- +goose Up
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isbn TEXT NOT NULL REFERENCES books(isbn) ON DELETE CASCADE,
    user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    review TEXT NOT NULL,
    stars DECIMAL,
    UNIQUE (user_id, isbn)
);

-- +goose Down
DROP TABLE reviews;
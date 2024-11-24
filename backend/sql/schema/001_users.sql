-- +goose Up
CREATE TABLE users (
    id uuid PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- +goose Down
DROP TABLE users;
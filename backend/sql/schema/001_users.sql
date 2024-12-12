-- +goose Up
CREATE TABLE users (
    id VARCHAR(128) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL
);

-- +goose Down
DROP TABLE users;
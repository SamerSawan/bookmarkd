-- +goose Up
CREATE TABLE books (
    isbn INT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    publish_date DATE NOT NULL,
    pages INT NOT NULL,
    description TEXT NOT NULL
);

-- +goose Down
DROP TABLE books;
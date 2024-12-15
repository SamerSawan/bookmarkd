-- +goose Up
CREATE TABLE shelf_books (
    id uuid PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    shelf_id uuid NOT NULL,
    book_isbn INT NOT NULL,
    FOREIGN KEY (shelf_id) REFERENCES shelves(id) ON DELETE CASCADE,
    FOREIGN KEY (book_isbn) REFERENCES books(isbn) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE shelf_books;
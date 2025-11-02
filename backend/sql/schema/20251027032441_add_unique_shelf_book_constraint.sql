-- +goose Up
ALTER TABLE shelf_books
ADD CONSTRAINT unique_shelf_book UNIQUE (shelf_id, book_isbn);

-- +goose Down
ALTER TABLE shelf_books
DROP CONSTRAINT unique_shelf_book;

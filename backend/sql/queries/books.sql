-- name: CreateBook :one
INSERT INTO books ( isbn, created_at, updated_at, title, author, cover_image_url, publish_date, pages, description)
VALUES (
    $1,
    NOW(),
    NOW(),
    $2,
    $3,
    $4,
    $5,
    $6,
    $7
    ) RETURNING *;

-- name: GetBook :one
SELECT * FROM books WHERE isbn = $1;

-- name: ResetBooks :exec
DELETE FROM books;

-- name: GetBooksInShelf :many
SELECT book_isbn FROM shelf_books WHERE shelf_id = $1;
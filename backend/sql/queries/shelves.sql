-- name: CreateShelf :one
INSERT INTO shelves (id, created_at, updated_at, name) 
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1
) RETURNING *;

-- name: GetShelf :one
SELECT * FROM shelves WHERE id = $1;

-- name: GetUsersShelves :many
SELECT * FROM user_shelves WHERE user_id = $1;

-- name: AddBookToShelf :one
INSERT INTO shelf_books (id, created_at, updated_at, shelf_id, book_isbn)
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1,
    $2
) RETURNING *;

-- name: RemoveBookFromShelf :exec
DELETE FROM shelf_books WHERE shelf_id = $1 AND book_isbn = $2;

-- name: GetBookFromShelf :one
SELECT * FROM shelf_books WHERE shelf_id = $1 AND book_isbn = $2;

-- name: GetShelvesContainingBook :many
SELECT sb.shelf_id
FROM shelf_books sb
INNER JOIN user_shelves us ON sb.shelf_id = us.shelf_id
WHERE sb.book_isbn = $1 AND us.user_id = $2;
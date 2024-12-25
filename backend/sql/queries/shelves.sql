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
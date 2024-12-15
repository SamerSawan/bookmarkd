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

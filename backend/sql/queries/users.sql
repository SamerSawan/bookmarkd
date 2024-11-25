-- name: CreateUser :one
INSERT INTO users ( id, created_at, updated_at, email, password )
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1,
    $2
) RETURNING *;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: AddBookToUser :one
INSERT INTO user_books ( id, user_id, isbn, status, updated_at )
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    NOW()
) RETURNING *;

-- name: UpdateBookStatus :one
UPDATE user_books SET 
    status = $1,
    started_at = CASE WHEN $1 = 'Reading' THEN CURRENT_DATE ELSE started_at END
WHERE user_id = $2 AND isbn = $3
RETURNING *;

-- name: UpdateBookProgress :one
UPDATE user_books SET 
    progress = $1,
    finished_at = CASE WHEN $1 = 100 THEN CURRENT_DATE ELSE finished_at END 
WHERE user_id = $2 AND isbn = $3
RETURNING *;
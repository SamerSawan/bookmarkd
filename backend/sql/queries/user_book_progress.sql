-- name: UpdateProgressWithComment :one
INSERT INTO user_book_progress (user_book_id, progress, comment)
VALUES (
    (SELECT id FROM user_books WHERE user_id = $1 AND isbn = $2),
    $3,
    $4
) RETURNING *;

-- name: FetchProgressUpdate :one
SELECT * FROM user_book_progress 
WHERE user_book_id = (SELECT id FROM user_books WHERE user_id = $1 AND isbn = $2) 
ORDER BY created_at DESC;
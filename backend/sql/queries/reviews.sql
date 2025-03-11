-- name: CreateReview :one
INSERT INTO reviews ( isbn, user_id, review, stars )
VALUES (
    $1,
    $2,
    $3,
    $4
) RETURNING *;

-- name: GetReview :one
SELECT * FROM reviews WHERE isbn = $1 AND user_id = $2;

-- name: DeleteReview :exec
DELETE FROM reviews WHERE isbn = $1 AND user_id = $2;

-- name: GetBookReviews :many
SELECT * FROM reviews WHERE isbn = $1;


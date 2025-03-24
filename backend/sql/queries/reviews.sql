-- name: CreateReview :one
INSERT INTO reviews ( isbn, user_id, review, stars, recommended )
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
) RETURNING *;

-- name: GetReview :one
SELECT * FROM reviews WHERE isbn = $1 AND user_id = $2;

-- name: DeleteReview :exec
DELETE FROM reviews WHERE isbn = $1 AND user_id = $2;

-- name: GetBookReviews :many
SELECT 
    r.id,
    r.isbn,
    r.user_id,
    r.review,
    r.stars,
    r.recommended,
    r.created_at,
    u.username,
    b.title,
    b.cover_image_url
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN books b ON r.isbn = b.isbn
WHERE r.isbn = $1;

-- name: GetRecentReviews :many
SELECT
    r.id,
    r.isbn,
    r.user_id,
    r.review,
    r.stars,
    r.recommended,
    r.created_at,
    u.username,
    b.title,
    b.cover_image_url
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN books b ON r.isbn = b.isbn
ORDER BY r.created_at DESC
LIMIT $1 OFFSET $2;

-- name: GetReviewsByUser :many
SELECT
  r.id,
  r.isbn,
  b.title,
  r.stars,
  r.recommended,
  r.review,
  r.created_at,
  u.username,
  b.cover_image_url
FROM reviews r
JOIN books b ON r.isbn = b.isbn
JOIN users u ON r.user_id = u.id
WHERE r.user_id = $1
ORDER BY r.created_at DESC;


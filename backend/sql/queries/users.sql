-- name: CreateUser :one
INSERT INTO users ( id, created_at, updated_at, email, username )
VALUES (
    $1,
    NOW(),
    NOW(),
    $2,
    $3
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
    started_at = CASE WHEN $1 = 'Reading' THEN CURRENT_DATE ELSE started_at END,
    finished_at = CASE WHEN $1 = 'Read' THEN CURRENT_DATE ELSE finished_at END
WHERE user_id = $2 AND isbn = $3
RETURNING *;

-- name: UpdateBookProgress :one
UPDATE user_books SET
    progress = $1,
    finished_at = CASE
        WHEN $1 >= (SELECT pages FROM books WHERE books.isbn = $3) THEN CURRENT_DATE
        ELSE finished_at
    END,
    status = CASE
        WHEN $1 >= (SELECT pages FROM books WHERE books.isbn = $3) THEN 'Read'
        ELSE status
    END
WHERE user_id = $2 AND user_books.isbn = $3
RETURNING *;

-- name: DeleteUserBookEntry :exec
DELETE FROM user_books WHERE user_id = $1 AND isbn = $2;

-- name: AddShelfToUser :one
INSERT INTO user_shelves (id, created_at, updated_at, user_id, shelf_id)
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1,
    $2
) RETURNING *;

-- name: GetUserBook :one
SELECT * FROM user_books WHERE user_id = $1 AND isbn = $2;

-- name: GetLatestCurrentlyReadingBook :many
SELECT 
    b.isbn,
    b.title,
    b.author,
    b.cover_image_url,
    b.publish_date,
    b.pages,
    b.description,
    ub.progress
FROM
    user_books ub
JOIN
    books b ON ub.isbn = b.isbn
WHERE
    ub.user_id = $1
    AND ub.status = 'Currently Reading'
ORDER BY
    ub.updated_at DESC;

-- name: RemoveUserBook :exec
DELETE FROM user_books WHERE user_id = $1 AND isbn = $2;

-- name: GetAverageRatingByUser :one
SELECT COALESCE(AVG(stars), 0) AS avg_rating
FROM reviews
WHERE user_id = $1;

-- name: CountBooksReadByUser :one
SELECT COUNT(*) AS count
FROM user_books
WHERE user_id = $1 AND status = 'Read';

-- name: CountReviewsWrittenByUser :one
SELECT COUNT(*) AS count
FROM reviews
WHERE user_id = $1;

-- name: GetUserProfileByUsername :one
SELECT
  id,
  username,
  bio,
  profile_image_url
FROM users
WHERE username = $1;

-- name: UpdateUserProfile :one
UPDATE users
SET
  bio = COALESCE($2, bio),
  profile_image_url = COALESCE($3, profile_image_url)
WHERE id = $1
RETURNING id, username, email, bio, profile_image_url, created_at, updated_at;

-- name: ResetUsers :exec
DELETE FROM users;
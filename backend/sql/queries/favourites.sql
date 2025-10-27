-- name: GetFavourites :many
SELECT * FROM favourites WHERE user_id = $1;

-- name: CreateFavourite :one
INSERT INTO favourites ( user_id, isbn )
VALUES (
    $1,
    $2
) RETURNING *;

-- name: RemoveFavourite :exec
DELETE FROM favourites WHERE user_id = $1 AND isbn = $2;

-- name: GetFavouritesVerbose :many
SELECT
  f.isbn,
  f.user_id,
  f.id,
  b.title,
  b.author,
  b.cover_image_url,
  b.publish_date,
  b.pages,
  b.description
FROM favourites f
JOIN users u ON u.id = f.user_id
JOIN books b ON b.isbn = f.isbn
WHERE f.user_id = $1;
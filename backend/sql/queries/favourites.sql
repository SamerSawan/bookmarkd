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
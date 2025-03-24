-- +goose Up
ALTER TABLE users
ADD COLUMN bio TEXT,
ADD COLUMN profile_image_url TEXT;

-- +goose Down
ALTER TABLE users
DROP COLUMN bio,
DROP COLUMN profile_image_url;

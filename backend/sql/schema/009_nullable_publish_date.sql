-- +goose Up
ALTER TABLE books
ALTER COLUMN publish_date DROP NOT NULL;

-- +goose Down
ALTER TABLE books
ALTER COLUMN publish_date SET NOT NULL;

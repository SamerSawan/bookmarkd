-- +goose Up
ALTER TABLE user_books
ALTER COLUMN progress SET DEFAULT 0,
ALTER COLUMN progress SET NOT NULL;

-- +goose Down
ALTER TABLE user_books
ALTER COLUMN progress DROP DEFAULT; -- Remove default value
ALTER COLUMN progress DROP NOT NULL; -- Allow progress to be null

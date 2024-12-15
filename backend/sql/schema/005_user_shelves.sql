-- +goose Up
CREATE TABLE user_shelves (
    id uuid PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    shelf_id uuid UNIQUE NOT NULL,
    FOREIGN KEY (user_id) references users(id) ON DELETE CASCADE,
    FOREIGN KEY (shelf_id) references shelves(id) ON DELETE CASCADE,
    UNIQUE (user_id, shelf_id)
);

-- +goose Down
DROP TABLE user_shelves;
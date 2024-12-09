// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: users.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const addBookToUser = `-- name: AddBookToUser :one
INSERT INTO user_books ( id, user_id, isbn, status, updated_at )
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    NOW()
) RETURNING id, user_id, isbn, status, progress, started_at, finished_at, lent_to, updated_at
`

type AddBookToUserParams struct {
	UserID uuid.UUID
	Isbn   string
	Status string
}

func (q *Queries) AddBookToUser(ctx context.Context, arg AddBookToUserParams) (UserBook, error) {
	row := q.db.QueryRowContext(ctx, addBookToUser, arg.UserID, arg.Isbn, arg.Status)
	var i UserBook
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Isbn,
		&i.Status,
		&i.Progress,
		&i.StartedAt,
		&i.FinishedAt,
		&i.LentTo,
		&i.UpdatedAt,
	)
	return i, err
}

const createUser = `-- name: CreateUser :one
INSERT INTO users ( id, created_at, updated_at, email, password )
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1,
    $2
) RETURNING id, created_at, updated_at, email, password
`

type CreateUserParams struct {
	Email    string
	Password string
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, createUser, arg.Email, arg.Password)
	var i User
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Email,
		&i.Password,
	)
	return i, err
}

const deleteUserBookEntry = `-- name: DeleteUserBookEntry :exec
DELETE FROM user_books WHERE user_id = $1 AND isbn = $2
`

type DeleteUserBookEntryParams struct {
	UserID uuid.UUID
	Isbn   string
}

func (q *Queries) DeleteUserBookEntry(ctx context.Context, arg DeleteUserBookEntryParams) error {
	_, err := q.db.ExecContext(ctx, deleteUserBookEntry, arg.UserID, arg.Isbn)
	return err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, created_at, updated_at, email, password FROM users WHERE email = $1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Email,
		&i.Password,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT id, created_at, updated_at, email, password FROM users WHERE id = $1
`

func (q *Queries) GetUserByID(ctx context.Context, id uuid.UUID) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Email,
		&i.Password,
	)
	return i, err
}

const resetUsers = `-- name: ResetUsers :exec
DELETE FROM users
`

func (q *Queries) ResetUsers(ctx context.Context) error {
	_, err := q.db.ExecContext(ctx, resetUsers)
	return err
}

const updateBookProgress = `-- name: UpdateBookProgress :one
UPDATE user_books SET 
    progress = $1,
    finished_at = CASE WHEN $1 = 100 THEN CURRENT_DATE ELSE finished_at END 
WHERE user_id = $2 AND isbn = $3
RETURNING id, user_id, isbn, status, progress, started_at, finished_at, lent_to, updated_at
`

type UpdateBookProgressParams struct {
	Progress sql.NullInt32
	UserID   uuid.UUID
	Isbn     string
}

func (q *Queries) UpdateBookProgress(ctx context.Context, arg UpdateBookProgressParams) (UserBook, error) {
	row := q.db.QueryRowContext(ctx, updateBookProgress, arg.Progress, arg.UserID, arg.Isbn)
	var i UserBook
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Isbn,
		&i.Status,
		&i.Progress,
		&i.StartedAt,
		&i.FinishedAt,
		&i.LentTo,
		&i.UpdatedAt,
	)
	return i, err
}

const updateBookStatus = `-- name: UpdateBookStatus :one
UPDATE user_books SET 
    status = $1,
    started_at = CASE WHEN $1 = 'Reading' THEN CURRENT_DATE ELSE started_at END
WHERE user_id = $2 AND isbn = $3
RETURNING id, user_id, isbn, status, progress, started_at, finished_at, lent_to, updated_at
`

type UpdateBookStatusParams struct {
	Status string
	UserID uuid.UUID
	Isbn   string
}

func (q *Queries) UpdateBookStatus(ctx context.Context, arg UpdateBookStatusParams) (UserBook, error) {
	row := q.db.QueryRowContext(ctx, updateBookStatus, arg.Status, arg.UserID, arg.Isbn)
	var i UserBook
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Isbn,
		&i.Status,
		&i.Progress,
		&i.StartedAt,
		&i.FinishedAt,
		&i.LentTo,
		&i.UpdatedAt,
	)
	return i, err
}

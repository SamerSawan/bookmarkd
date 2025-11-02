# Build stage
FROM golang:1.23.2-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bookmarkd .

# Runtime stage
FROM debian:stable-slim

# Install CA certificates
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the binary from builder
COPY --from=builder /app/bookmarkd /bin/bookmarkd

ENV PORT=8080

EXPOSE 8080

CMD ["/bin/bookmarkd"]
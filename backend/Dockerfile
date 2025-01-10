FROM debian:stable-slim

COPY bookmarkd /bin/bookmarkd

RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates && rm -rf /var/lib/apt/lists/*

ENV PORT=8080

EXPOSE 8080

CMD ["/bin/bookmarkd"]
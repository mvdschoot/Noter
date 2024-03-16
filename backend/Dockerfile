# FROM ubuntu:jammy
# WORKDIR /usr/src/
# # Build on host and simply copy the executable.
# COPY ./target/release/backend ./backend
# COPY Rocket.toml .
# ENV MONGO_URI mongodb://note-mongo:27017
# ENV MONGO_DB_NAME notes
# EXPOSE 8000
# CMD ["./backend"]


FROM rust:latest as builder
WORKDIR /app
COPY . .
RUN cargo install --path .


FROM ubuntu:jammy as runner
COPY --from=builder /usr/local/cargo/bin/backend /usr/local/bin/backend

COPY Rocket.toml .
ENV MONGO_URI mongodb://note-mongo:27017
ENV MONGO_DB_NAME notes

EXPOSE 8000
CMD ["backend"]
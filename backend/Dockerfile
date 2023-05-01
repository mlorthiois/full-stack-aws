FROM golang:1.20.3-alpine3.17

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
COPY ./ ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-back

EXPOSE 3000

CMD ["/docker-back"]

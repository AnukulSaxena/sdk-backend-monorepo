# Running the Application with Docker

This document provides instructions on how to run the application using Docker and Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

## Running the Application

To start the application, run the following command from the root of the project:

```bash
docker-compose up -d
```

**Explanation:**

*   `docker-compose up`: This command builds, (re)creates, starts, and attaches to containers for a service.
*   `-d`: This flag runs the containers in detached mode, meaning they run in the background.

## Common Errors and Solutions

Here are some common errors you might encounter and how to resolve them:

### 1. Docker Daemon Not Running

**Error Message:**

```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

**Solution:**

This error means that the Docker service is not running on your machine. Start the Docker daemon and try the command again.

### 2. Port Conflict

**Error Message:**

```
Error starting userland proxy: listen tcp4 0.0.0.0:8080: bind: address already in use
```

**Solution:**

This error occurs when another application is already using the port that Docker is trying to use (in this case, port 8080). To fix this, you can either:

*   Stop the other application that is using the port.
*   Change the port mapping in the `docker-compose.yml` file. For example, to use port 8081 instead of 8080, change the following line in the `api-gateway` service definition:

    ```yaml
    ports:
      - "8081:3000"
    ```

### 3. Build Failures

**Error Message:**

```
failed to solve: failed to compute cache key: ... not found
```

**Solution:**

This error can sometimes occur due to caching issues with Docker. To resolve this, you can try rebuilding the images without using the cache:

```bash
docker-compose build --no-cache
```

Then, try starting the application again:

```bash
docker-compose up -d
```

## Viewing Logs

To view the logs of the running services, use the following commands:

*   To view the logs of the API gateway:

    ```bash
    docker-compose logs -f api-gateway
    ```

*   To view the logs of the user service:

    ```bash
    docker-compose logs -f user-service
    ```

The `-f` flag follows the log output, so you can see new logs as they are generated.

## Stopping the Application

To stop and remove the containers, networks, and volumes created by `docker-compose up`, run the following command:

```bash
docker-compose down
```

# ARG to make the Dockerfile reusable for other apps
ARG APP_NAME=user-service
ARG NODE_VERSION=22-alpine

# ---- Stage 1: Builder ----
# This stage builds the application
FROM node:${NODE_VERSION} AS builder

# Set working directory
WORKDIR /usr/src/app

# Set the app name as an env var
ARG APP_NAME
ENV APP_NAME=$APP_NAME

# Copy dependency-defining files first to leverage Docker cache
COPY package.json package-lock.json ./
COPY nx.json tsconfig.base.json ./

# Install all dependencies (including dev dependencies needed for build)
# Using --legacy-peer-deps for compatibility if needed
RUN npm install --legacy-peer-deps

# Copy the entire monorepo source code
COPY . .

# Build the specific application in production mode
# This command uses NX to build only the code and dependencies for the target app
RUN npx nx build ${APP_NAME} --prod


# ---- Stage 2: Production ----
# This stage creates the final, lean production image
FROM node:${NODE_VERSION} AS production

# Set working directory
WORKDIR /usr/src/app

# Declare the build argument again for this stage
ARG APP_NAME
# Set the app name as an env var
ENV APP_NAME=${APP_NAME}

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install ONLY production dependencies
RUN npm install --production

# Copy the built application from the 'builder' stage
COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} .

# Expose the port the application will run on
# This should match the port configured in your app's main.ts
EXPOSE 3001

# The command to run the application
CMD ["node", "main.js"]
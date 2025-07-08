# ARG to make the Dockerfile reusable for other apps
ARG APP_NAME=api-gateway
ARG NODE_VERSION=22-alpine

# ---- Stage 1: Builder ----
FROM node:${NODE_VERSION} AS builder

WORKDIR /usr/src/app

# Set build-time variables
ARG APP_NAME
ENV APP_NAME=$APP_NAME

# Step 1: Copy package files and install dev dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 2: Copy Nx workspace configs (needed by the build)
COPY nx.json tsconfig.base.json ./

# Step 3: Copy everything else
COPY . .

# Step 4: Build target app
RUN npx nx build ${APP_NAME} --prod

# ---- Stage 2: Production ----
FROM node:${NODE_VERSION} AS production

WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Copy production dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy built output from builder
COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./

# Set exposed port
EXPOSE 3001

# Run the app
CMD ["node", "main.js"]

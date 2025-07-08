# ARG to make the Dockerfile reusable for other apps
ARG APP_NAME=api-gateway 
ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} 

# Set environment variables for the app and watcher
WORKDIR /usr/src/app

# Set build-time variables
ARG APP_NAME
ENV APP_NAME=$APP_NAME

# This is crucial for file watch events when mounting volumes from the host
ENV CHOKIDAR_USEPOLLING=true

# Copy package.json and package-lock.json first to leverage Docker cache
# This layer will only be rebuilt if these files change
COPY package.json package-lock.json ./
RUN npm install

# Expose the default port for Nx dev server (often 3000, 3001, etc. - check your project.json)
# Assuming 3000 for api-gateway based on your production Dockerfile
EXPOSE 3000

CMD ["npx", "nx", "serve", "api-gateway"]
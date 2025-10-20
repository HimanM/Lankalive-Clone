# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install dependencies (this layer will be cached if package.json doesn't change)
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Accept build argument for API URL (after npm ci to avoid cache invalidation)
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

# Build the application with environment variable
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

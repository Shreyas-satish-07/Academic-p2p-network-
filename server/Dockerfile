# Cohort Backend Dockerfile
FROM node:20-alpine AS runner

# Create app directory
WORKDIR /app

# Install system dependencies if required
RUN apk add --no-cache curl

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Environment configuration
ENV NODE_ENV=production
ENV PORT=5000

# Expose server port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the Express server
CMD ["node", "server.js"]


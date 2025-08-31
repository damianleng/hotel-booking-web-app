# ---- base image ----
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Faster, repeatable installs
COPY package*.json ./
RUN npm ci --omit=dev

# Copy app source
COPY . .

# Install curl for HEALTHCHECK
RUN apk add --no-cache curl

# Container listens here
EXPOSE 3000

# Optional: container-level healthcheck (nice for docker & k8s)
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD curl -fsS http://localhost:3000/health || exit 1

# Start the API (change to your real entrypoint if needed)
CMD ["node", "server.js"]

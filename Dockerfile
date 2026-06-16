# Build a small production image for the World Clock app.
FROM node:20-alpine

# Create app directory.
WORKDIR /usr/src/app

# Install production dependencies first to leverage Docker layer caching.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the application source.
COPY server.js ./
COPY public ./public

# Run as the non-root user provided by the base image.
USER node

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]

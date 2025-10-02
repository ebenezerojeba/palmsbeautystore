
# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --production

# COPY . .

# EXPOSE 8000

# CMD ["node", "server.js"]






FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

EXPOSE 8000

CMD ["node", "server.js"]

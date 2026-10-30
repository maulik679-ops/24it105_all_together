FROM node:20-alpine

WORKDIR /app

# Copy package files first for cached layer installation
COPY package*.json ./

RUN npm install --production

# Copy application code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]

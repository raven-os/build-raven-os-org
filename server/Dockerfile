FROM node:10

ENV NODE_ENV=production

WORKDIR /app

# Install server dependencies
COPY package.json .
RUN npm install --only=production

# Install server
COPY . .

EXPOSE 8000

CMD ["node", "src/index.js"]

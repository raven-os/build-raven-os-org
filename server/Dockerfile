FROM node:12.13.1

WORKDIR /app

# Install server dependencies
COPY package.json .
RUN npm install

# Install server
COPY . .

EXPOSE 8000

CMD ["node", "src/index.js"]

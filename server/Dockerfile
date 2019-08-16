FROM node:10

ENV NODE_ENV=production

RUN mkdir -p /home/node/api
WORKDIR /home/node/api

# Install server dependencies
COPY package.json .
RUN npm install --only=production

# Install server
COPY . .

EXPOSE 8000

USER node

CMD ["node", "src/index.js"]

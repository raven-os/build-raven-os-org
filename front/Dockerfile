FROM node:10

RUN mkdir -p /home/node/front
WORKDIR /home/node/front

# Install front dependencies
COPY package.json .
RUN npm install

# Install front
COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]

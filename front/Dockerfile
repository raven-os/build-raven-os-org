FROM node:10
ENV NODE_ENV=production
WORKDIR /app

# Install front dependencies
COPY package.json .
RUN npm install

# Install front
COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]

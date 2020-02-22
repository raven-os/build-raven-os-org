FROM node:12.13.1

WORKDIR /app

# Download docker cli
RUN apt-get update && apt-get install -y -q \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    software-properties-common

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
RUN apt-key fingerprint 0EBFCD88
RUN add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"

RUN apt-get update && apt-get install -y -q \
    docker-ce-cli

# Install builder dependencies
COPY package.json .
RUN npm install

# Install builder
COPY . .

EXPOSE 8000

CMD ["node", "src/index.js"]

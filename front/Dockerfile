FROM debian:sid

RUN apt-get update

# Install NodeJS 10
RUN apt-get install -y -q \
    curl \
    software-properties-common \
    build-essential

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

RUN mkdir /app
WORKDIR /app

# Install server dependencies
COPY package.json /app/package.json
RUN npm install

# Install builder
COPY . /app

CMD ["npm", "run", "serve"]

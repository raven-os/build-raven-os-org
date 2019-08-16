FROM debian:sid

ENV NODE_ENV=production

# Install python and dependencies to download NodeJS
RUN apt-get update && apt-get install -y -q \
    bc \
    curl \
    libelf-dev \
    software-properties-common \
    tree \
    python3 \
    python3-pip

# Download and install NodeJS 10
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

RUN mkdir /app
WORKDIR /app

# Install nbuild dependencies
COPY nbuild/requirements.txt /app/nbuild/requirements.txt
RUN pip3 install -r /app/nbuild/requirements.txt

# Install builder dependencies
COPY package.json /app/package.json
RUN npm install --only=production

# Install nbuild
COPY nbuild/ /app/nbuild

# Install builder
COPY . /app

CMD ["node", "src/index.js"]

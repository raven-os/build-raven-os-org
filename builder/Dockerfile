FROM debian:sid

RUN apt-get update

# Install python
RUN apt install -y -q \
    python3 \
    python3-pip \
    libelf-dev \
    bc \
    tree

# Install NodeJS 10
RUN apt-get install -y -q \
    curl \
    software-properties-common

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

RUN mkdir /app
WORKDIR /app

# Install nbuild dependencies
COPY nbuild/requirements.txt /app/nbuild/requirements.txt
RUN pip3 install -r /app/nbuild/requirements.txt

# Install builder dependencies
COPY package.json /app/package.json
RUN npm install

# Install nbuild
COPY nbuild/ /app/nbuild

# Install builder
COPY . /app

CMD ["npm", "start"]

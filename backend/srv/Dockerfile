FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./server/package*.json ./

RUN npm ci

# Bundle app source
COPY ./server .

EXPOSE 3001
CMD [ "node", "app.js" ]
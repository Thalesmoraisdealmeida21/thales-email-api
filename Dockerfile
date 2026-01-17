FROM node:20-alpine

WORKDIR /app
COPY package.json yarn.lock* ./
RUN npm install -g corepack && \
    yarn install --frozen-lockfile && \
    yarn cache clean && \
    rm -rf /tmp/* /var/cache/apk/*
COPY tsconfig.json ./
COPY src ./src
RUN yarn build
RUN rm -rf /usr/local/share/.cache /root/.cache

EXPOSE 3000:3000
CMD [ "node", "dist/server.js" ]









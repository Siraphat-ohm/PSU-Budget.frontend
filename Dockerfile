# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install 
COPY . .
COPY .env.local .env.local
RUN yarn build

# Production Stage
FROM node:18-alpine 

WORKDIR /app
COPY --from=builder /app .

EXPOSE 3000

CMD [ "yarn", "start" ]

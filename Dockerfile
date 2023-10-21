# Stage 1: Build the application
FROM node:18-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Create the final image
FROM node:18-alpine

WORKDIR /app
COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

ENV NODE_ENV=production \
    NEXT_PUBLIC_API_ENDPOINT='' \
    NEXTAUTH_SECRET='' \
    NEXTAUTH_URL='' 

EXPOSE 3000

CMD [ "yarn", "start" ]

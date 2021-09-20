FROM node:alpine as builder

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf


# FROM node:11.8 AS build
# WORKDIR /app

# COPY . .

# RUN yarn

# RUN yarn build

# WORKDIR /usr/app


# FROM nginx:stable

# COPY --from=build /app/build/ /usr/share/nginx/html
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf


# # EXPOSE 80
# # # CMD ["nginx", "-g", "daemon off;"]
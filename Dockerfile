FROM node:20
WORKDIR /build
COPY package.json package.json
RUN yarn install

COPY . .
RUN yarn run build

# Create the image serving the website.
FROM nginx
COPY --from=0 /build/build /usr/share/nginx/html
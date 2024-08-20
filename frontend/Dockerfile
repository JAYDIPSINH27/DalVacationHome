FROM node:20-alpine as build-stage
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV VITE_API_BASE_URL=VITE_API_BASE_URL
ENV VITE_COGNITO_USER_POOL_ID=VITE_COGNITO_USER_POOL_ID
ENV VITE_COGNITO_CLIENT_ID=VITE_COGNITO_CLIENT_ID
ENV VITE_APP_AWS_ACCESS_KEY_ID=VITE_APP_AWS_ACCESS_KEY_ID
ENV VITE_APP_AWS_SECRET_ACCESS_KEY=VITE_APP_AWS_SECRET_ACCESS_KEY
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/dist .
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]

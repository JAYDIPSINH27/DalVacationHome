FROM node:20-alpine as build-stage
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV VITE_API_BASE_URL=https://hmemmeyh1b.execute-api.us-east-1.amazonaws.com/dev
ENV VITE_COGNITO_USER_POOL_ID=us-east-1_1gMhUA7Dk
ENV VITE_COGNITO_CLIENT_ID=o34gskfq8rhs79510f4totqe7
ENV VITE_APP_AWS_ACCESS_KEY_ID=AKIAZQ3DQN4JFPMWL7FD
ENV VITE_APP_AWS_SECRET_ACCESS_KEY=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
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/dist .
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
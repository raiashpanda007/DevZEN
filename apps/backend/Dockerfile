FROM node:24-alpine3.21
RUN npm install -g pnpm
WORKDIR /code
COPY package.json ./
RUN pnpm install
COPY . .
EXPOSE 8080
CMD ["pnpm", "start"]



FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies including dev
ENV NODE_ENV=development
RUN npm install

COPY . .

# Build app
RUN npm run build

EXPOSE 5174

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5174"]
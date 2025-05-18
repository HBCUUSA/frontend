# Step 1: Build the React app
FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve the build using nginx
FROM nginx:alpine

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

# 👇 Add this line to use your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

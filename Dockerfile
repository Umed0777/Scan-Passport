# Stage 1: сборка React-приложения
FROM node:18-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Принимаем аргументы
ARG VITE_API_URL

# Устанавливаем переменные окружения (Vite подхватит их)
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Stage 2: отдача через nginx
FROM nginx:alpine

# Копируем сборку из предыдущего этапа в папку nginx для статических файлов
COPY --from=build /app/dist /usr/share/nginx/html

# Опционально: можно добавить свой конфиг nginx для SPA
 COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

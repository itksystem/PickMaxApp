#!/bin/bash

# Название образа Docker
IMAGE_NAME="docker.io/itksystem/pickmax-service:latest"

# Остановить и удалить контейнер, если он уже запущен
echo "Остановка и удаление существующего контейнера..."
docker stop pickmax-service || true
docker rm pickmax-service || true

# Удаление локального образа Docker
echo "Удаление локального образа $IMAGE_NAME..."
docker rmi $IMAGE_NAME || true
# Загрузка образа из Docker Hub
echo "Загрузка образа $IMAGE_NAME из Docker Hub..."
docker pull $IMAGE_NAME

# Запуск нового контейнера
echo "Запуск нового контейнера..."

sudo docker run -d -t -i  \
--restart unless-stopped \
-p 3999:3999 \
--env-file .env-pickmax-service 
--name pickmax-service $IMAGE_NAME

echo "Контейнер успешно обновлен и запущен."

# Используем официальный образ Node.js 14 на базе Debian
FROM node:14

# Устанавливаем метаданные
LABEL maintainer="Dmitriy Sinyagin <itk_system@mail.ru>"

# Устанавливаем временную зону
ENV TZ=Europe/Moscow
RUN apt-get update && apt-get install -y tzdata

# Устанавливаем bash и mc (Midnight Commander)
RUN apt-get update && apt-get install -y bash mc

# Создаем рабочую директорию
RUN mkdir -p /var/www
WORKDIR /var/www

# Копируем файлы проекта
COPY ./ /var/www

# Устанавливаем зависимости
RUN npm install

# Публикуем порты
EXPOSE 3000
EXPOSE 3999

# Запускаем приложение
CMD [ "node", "app.js" ]
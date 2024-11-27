FROM node:14
MAINTAINER Dmitriy Sinyagin <itk_system@mail.ru>
ENV TZ=Europe/Moscow
RUN apt update
RUN npm install 
RUN mkdir /var/www
COPY ./ /var/www
RUN ls /var/www/*
WORKDIR /var/www
EXPOSE 3000
CMD [ "node", "app.js" ]

# ���������� ����������� ����� Node.js 14 �� ���� Debian
FROM node:14

# ������������� ����������
LABEL maintainer="Dmitriy Sinyagin <itk_system@mail.ru>"

# ������������� ��������� ����
ENV TZ=Europe/Moscow
RUN apt-get update && apt-get install -y tzdata

# ������������� bash � mc (Midnight Commander)
RUN apt-get update && apt-get install -y bash mc

# ������� ������� ����������
RUN mkdir -p /var/www
WORKDIR /var/www

# �������� ����� �������
COPY ./ /var/www

# ������������� �����������
RUN npm install

# ��������� �����
EXPOSE 3000
EXPOSE 3999

# ��������� ����������
CMD [ "node", "app.js" ]
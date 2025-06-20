FROM debian:bullseye

RUN apt update && \
    apt install -y apache2 openssl \
    libapache2-mod-php \
    php-pgsql \
    php-curl \
    php-json \
    php-mbstring \
    composer && \
    a2enmod ssl rewrite && \
    a2ensite default-ssl && \
    service apache2 restart

EXPOSE 80 443

CMD ["apachectl", "-D", "FOREGROUND"]

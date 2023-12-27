FROM alpine:latest

# Install dependencies
RUN apk --update add \
    apache2 \
    php \
    php-apache2 \
    git \
    && rm -rf /var/cache/apk/*

# Clone repository
RUN rm -r /var/www/localhost/htdocs/*

RUN git clone https://github.com/HeinzEric/FalconsEsportsOverlays.git /var/www/localhost/htdocs/

# Set permissions
RUN chmod -R 777 /var/www/localhost/htdocs/ \
    && chmod +x /var/www/localhost/htdocs/entrypointCommands.sh

WORKDIR /var/www/localhost/htdocs

EXPOSE 80/tcp

ENTRYPOINT ["./entrypointCommands.sh"]

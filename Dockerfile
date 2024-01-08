# Use the Alpine Linux base image
FROM alpine:latest

# Install Apache, PHP, and git
RUN apk --update add \
    apache2 \
    php \
    php-apache2 \
    git \
    neofetch \
    && rm -rf /var/cache/apk/* \
    && rm -r /var/www/localhost/htdocs/*

# Clones the repos
RUN git clone https://github.com/HeinzEric/FalconsEsportsOverlays.git /var/www/localhost/htdocs/

# sets the directory permissions for the files
RUN chmod 777 -R /var/www/localhost/htdocs/*

# Sets the permissions of the command list
RUN chmod +x /var/www/localhost/htdocs/entrypointCommands.sh

# Set the working directory
WORKDIR /var/www/localhost/htdocs

# Expose port 80 for Apache
EXPOSE 80/tcp

# Runs the startup commands
ENTRYPOINT ["./entrypointCommands.sh"]
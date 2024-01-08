#!/bin/bash
git reset --hard HEAD && git clean -f -d && git pull && chmod 777 -R /var/www/localhost/htdocs/* && httpd -D FOREGROUND
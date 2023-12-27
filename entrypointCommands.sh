#!/bin/bash
git reset --hard HEAD && git clean -f -d && git pull && httpd -D FOREGROUND
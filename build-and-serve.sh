#!/usr/bin/env bash

export SERVER_HOST="${SERVER_HOST:-127.0.0.1}"
export SERVER_PORT="${SERVER_PORT:-4000}"

echo "==> Installing bundle..."
bundle install
echo "==> Creating jekyll build"
bundle exec jekyll build --config _config.yml,_config.development.yml
echo "==> Launching web server"
bundle exec puma

#!/bin/sh
cd /app && git checkout package.json && rm -rf ./app/.babelrc && yarn
git pull origin master &&
cd /app && yarn buildWithDemo

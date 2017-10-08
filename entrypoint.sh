apk add --no-cache bash git &&
npm install -g yarn &&
yarn global add github-webhook &&
yarn global add serve &&
yarn global add pm2 &&
pm2 kill &&
cd /app && git checkout package.json && rm -rf ./app/.babelrc && yarn
git pull origin master &&
cd /app && yarn buildWithDemo &&
pm2 start /app/ecosystem.json &&
serve -p 3333 /app/demo/dist

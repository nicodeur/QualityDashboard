# 1rst, copy  conf file for front and server
cp -f conf.js front/conf.js
cp -f conf.js server/conf.js

cd server
./start.sh
cd ../front
./start.sh

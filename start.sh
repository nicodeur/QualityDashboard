# 1rst, copy  conf file for front and server
cp -f conf/conf.js front/conf.js
cp -f conf/conf.js server/conf.js

if [ ! -d "logs" ]; then
	mkdir logs
fi

cd server
./start.sh
cd ../front
./start.sh

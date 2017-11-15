# 1rst, copy  conf file for front and server
if [ ! -d "logs" ]; then
	mkdir logs
fi

cd server
./start.sh
cd ../front
./start.sh

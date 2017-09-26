# 1rst, copy  conf file for front and server
cp -f conf/conf.js front/conf.js
cp -f conf/conf.js server/conf.js

if [ ! -d "logs" ]; then
	mkdir logs
fi

cd front

echo "";
echo "-------------------------------------------------";
echo "-- Install front server dependancies                   "; 
echo "-------------------------------------------------"
echo "";

#npm install http-server -g
  
  

cd ../server

echo "";
echo "-------------------------------------------------";
echo "-- Install back server dependancies                   "; 
echo "-------------------------------------------------"
echo "";
  
#npm install


echo "";
echo "-------------------------------------------------";
echo "-- dependancies installed                  "; 
echo "-------------------------------------------------"
echo "";

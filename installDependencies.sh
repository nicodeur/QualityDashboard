if [ ! -d "logs" ]; then
	mkdir logs
fi

cd front

echo "";
echo "-------------------------------------------------";
echo "-- Install front server dependencies             "; 
echo "-------------------------------------------------"
echo "";

npm install http-server -g
  
  

cd ../server

echo "";
echo "-------------------------------------------------";
echo "-- Install back server dependencies              "; 
echo "-------------------------------------------------"
echo "";
  
npm install


echo "";
echo "-------------------------------------------------";
echo "-- dependencies installed                  	   "; 
echo "-------------------------------------------------"
echo "";

cd server

if [ -f "stop.sh" ]; then
  ./stop.sh
else 
	echo "server already stoped"
fi

cd ../front

if [ -f "stop.sh" ]; then
  ./stop.sh
else 
	echo "front already stoped"
fi

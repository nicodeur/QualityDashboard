#!/bin/sh


if [ -f "stop.sh" ]; then
  echo "server already run. stop it with stop.sh"
else
    
  echo "";
  echo "-------------------------------------------------";
  echo "-- Launch back server  ... "; 
  echo "-------------------------------------------------"
  echo "";
  
  
  cmd="nodemon server.js"
  nohup $cmd >> ../logs/server.log &

  # Storing the background process' PID.
  bg_pid=$!

  echo "#!/bin/sh
  kill -2 $bg_pid
  rm stop.sh
  echo \"\";
  echo \"-------------------------------------------------\";
  echo \"-- Back server succesfully stop \";
  echo \"-------------------------------------------------\";
  echo \"\";
  " > stop.sh

  chmod 755 stop.sh
  
  echo "";
  echo "-------------------------------------------------";
  echo "-- Back server succesfully launch (pid : $bg_pid)"; 
  echo "-- use stop.sh to stop it"; 
  echo "-------------------------------------------------"
  echo "";
fi

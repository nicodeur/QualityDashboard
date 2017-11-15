#!/bin/sh

port=8086


if [ -f "stop.sh" ]; then
  echo "Front server already run. stop it with stop.sh"
else

  echo "";
  echo "-------------------------------------------------";
  echo "-- Launch front server  ... "; 
  echo "-------------------------------------------------"
  echo "";
  
  nohup http-server . -p $port >> ../logs/front.log &
  
  # Storing the background process' PID.
  bg_pid=$!

  echo "#!/bin/sh
  kill -2 $bg_pid
  rm stop.sh
  echo \"\";
  echo \"-------------------------------------------------\";
  echo \"-- Front server succesfully stop \";
  echo \"-------------------------------------------------\";
  echo \"\";
  " > stop.sh

  chmod 755 stop.sh
  
  echo "";
  echo "-------------------------------------------------";
  echo "-- front server succesfully start (pid : $bg_pid)"; 
  echo "-- localhost:$port/"; 
  echo "-- use stop.sh to stop it"; 
  echo "-------------------------------------------------"
  echo "";
fi



#!/bin/sh


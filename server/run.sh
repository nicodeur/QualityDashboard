#!/bin/sh


if [ -f "stop.sh" ]; then
  echo "server already run. stop it with stop.sh"
else

  cmd="node server.js"
  nohup $cmd >> ../logs/server.log &

  # Storing the background process' PID.
  bg_pid=$!

  echo "#!/bin/sh
  kill -2 $bg_pid
  rm stop.sh" > stop.sh

  chmod 755 stop.sh
fi


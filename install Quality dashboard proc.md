# Install QualityDashboard on Production environement


## 1 - install node js

```
apt-get update
apt-get install nodejs npm
```

## 2 - get source of QualityDashboard

You can get latest release here : https://github.com/nicodeur/QualityDashboard/releases

Today, latest release is version 1.0.1, avalable here : https://github.com/nicodeur/QualityDashboard/archive/1.0.1.tar.gz

## 3 - unzip source

Go to repository you want install QualityDashboard, and untar archive

```
cd ..../......./.....
tar -xvzf <name_of_archive>.tar.gz
```

## 4 - Give right execution for sh file

```
chmod 755 installDependencies.sh && chmod 755 start.sh && chmod 755 front/start.sh  && chmod 755 server/start.sh && chmod 755 stop.sh && chmod 755 restart.sh
```

## 5 - Set configuration file

Configuration file must be copy into `conf` folder. It must be call conf.js. It must be deliver in same time of delivery asked.


## 6 - Install npm dependencies and run the application

```
./installDependencies.sh && ./start.sh
```

## 7 - Information

* Logs files are  write into logs/ folder.
* Application are available on <vm_host>:8086/
* You can stop application by call ./stop.sh
* You can restart application by call ./restart.sh


## To resume script you must run to deliver QualityDashboard
```
cd <application_location>
tar -xvzf <name_of_archive>.tar.gz
chmod 755 installDependencies.sh && chmod 755 start.sh && chmod 755 front/start.sh  && chmod 755 server/start.sh && chmod 755 stop.sh && chmod 755 restart.sh
cp <conf.js_location>/conf.js conf/conf.js
./installDependencies.sh && ./start.sh
```

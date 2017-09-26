# Run application with docker
Offical docker image exist !

Create a conf folder with your conf.js to configure dashboard. See conf docs to write it : https://github.com/nicodeur/QualityDashboard#settings

```
docker run -d --name qualitydashboard -v <log_path_on_host>:/opt/qualityReport/log -v <conf_path_on_host>:/opt/qualityReport/conf -p 8085:8085 -p 8086:8086 nicodeur/qualitydashboard
```
    
Your application is available on http://<host>:8086/

# Run last github version
You can build yourself last github version by using latest directory and docker cmd
```
docker-compose up -d 
```
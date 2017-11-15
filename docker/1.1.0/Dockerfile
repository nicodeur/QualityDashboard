FROM alpine:latest
MAINTAINER nicodeur <nico.deblock@gmail.com>

RUN apk update && apk add --update git nodejs nodejs-npm tar && npm install npm@latest -g && rm -rf /var/cache/apk/*

RUN wget https://github.com/nicodeur/QualityDashboard/archive/1.1.0.tar.gz && tar xzvf 1.1.0.tar.gz -C /opt/qualityReport

RUN  cd /opt/qualityReport && chmod 755 installDependencies.sh && ./installDependencies.sh

WORKDIR /opt/qualityReport

CMD chmod 755 start.sh && chmod 755 front/start.sh  && chmod 755 server/start.sh && chmod 755 stop.sh && chmod 755 restart.sh &&\
  ./start.sh && tail -f logs/server.log

EXPOSE 8085 8086

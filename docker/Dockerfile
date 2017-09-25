FROM alpine:latest
MAINTAINER nicodeur FERLET <nico.deblock@gmail.com>

RUN apk update && apk add --update git nodejs nodejs-npm && npm install npm@latest -g && \
  git clone https://github.com/nicodeur/QualityDashboard.git /opt/qualityReport




WORKDIR /opt/qualityReport

CMD chmod 755 start.sh && chmod 755 front/start.sh  && chmod 755 server/start.sh && \
  ./start.sh && tail -f logs/server.log

EXPOSE 8085 8086

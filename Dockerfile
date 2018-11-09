## --> [ Docker image to use ]
FROM node:10.13.0-alpine
MAINTAINER alsonfovaldes84@gmail.com

## --> [ Variables to build images ]
ARG _USER="nodeapp"
ARG _HOME="/home/${user}"
ARG _APP_DIR="${_HOME}/appjs"

## --> [ Create it's own user and move content within home ]
RUN adduser -D -h ${_HOME} -s /bin/sh ${_USER}
ADD . ${_APP_DIR}

## --> [ Install dependencies & Deploy application  ]
WORKDIR ${_APP_DIR}
RUN npm install

EXPOSE 3091
CMD npm run start

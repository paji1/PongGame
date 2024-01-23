# syntax=docker/dockerfile:1.4

# if you're doing anything beyond your local machine, please pin this to a specific version at https://hub.docker.com/_/node/
FROM node:lts AS development

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

WORKDIR /code

# default to port 80 for node, and 9229 and 9230 (tests) for debug

EXPOSE 8001

COPY package.json /code/package.json
COPY --chmod=777 package-lock.json /code/package-lock.json
COPY .npmrc /code/.npmrc
# check every 30s to ensure this service returns HTTP 200
RUN <<EOF
npm ci
npm ci class-validator
npm install -g @nestjs/cli
npm install -g ts-node
npm i --save-dev webpack webpack-cli webpack-node-externals ts-loader run-script-webpack-plugin
EOF
HEALTHCHECK --interval=30s \
  CMD node healthcheck.js
RUN <<EOF

EOF

# copy in our source code last, as it changes the most
COPY prisma /code/prisma
RUN <<EOF
npx prisma generate
EOF

COPY . /code
# RUN ls -la  
# RUN cat package*.json 
# RUN npm run build

# if you want to use npm start instead, then use `docker run --init in production`
# so that signals are passed properly. Note the code in index.js is needed to catch Docker signals
# using node here is still more graceful stopping then npm with --init afaik
# I still can't come up with a good production way to run with npm and graceful shutdown

FROM development as dev-envs
RUN <<EOF
apt-get update
apt-get install -y expect
apt-get install -y --no-install-recommends git
EOF

CMD [ "npm", "run", "t:d" ]

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /

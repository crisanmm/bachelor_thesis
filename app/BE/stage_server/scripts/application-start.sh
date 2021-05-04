#!/bin/bash
cd /home/ubuntu/websocket-server
yarn install --non-interactive
node `dirname "$BASH_SOURCE"`/application-start-create-env.js
yarn start
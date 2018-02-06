FROM node:9-onbuild

RUN npm run install:secrets
RUN npm run flow:check
RUN npm run migrate

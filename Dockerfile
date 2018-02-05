FROM node:9-onbuild

RUN npm run flow:check

FROM node:12-buster as builder
COPY . /build
WORKDIR /build
RUN npm run build

FROM node:12-buster-slim
RUN groupadd -g 6008 stone 
RUN useradd -M -s /bin/bash -d /data/ -u 6008 -g stone stone
COPY --from=builder /build /data
RUN chown -R 6008:6008 /data 
RUN chmod go= /data 
RUN npm config set strict-ssl false
RUN npm config set unsafe-perm true
# RUN npm install pm2 -g
RUN ls -al /data
WORKDIR /data
EXPOSE 3838
CMD [ "node", "app.js" ]
# CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
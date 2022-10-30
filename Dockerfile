FROM node:16-alpine


ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=pass \
    MONGO_URI=mongodb://admin:pass@localhost:27017
    
RUN mkdir -p /home/app

COPY . /home/app

CMD ["node","/home/app/bin/www"]
# task-manager-api

* This is all based on [Udemy Courses](https://www.udemy.com/). 
* Course nodejs developer.
* Main Entry file: index.js

Running index.js will create a localhost webserver running on the env port setup, connecting to a mongodb on port 27017.
ie: http://localhost:PORT/.  It also uses [Send Grid](https://sendgrid.com/) to send emails out.

## INSTALLATION
* Download nodejs from  [NodeJS Pages](https://nodejs.org/en/). and install latest current version
* Download MongoDB from [MongoDB Pages](https://www.mongodb.com/) and install the latest current version
* Surf to [Send Grid](https://sendgrid.com/pricing/) and setup an accout copy the API KEY and update the config/dummy_dev.env
* Please modify config/dummy_dev.env to be your db server ip ie localhost:27017/TABLENAME
* start a new shell/cmd promtp and run: FULL_PATH/mongod --dbpath=FULL_PATH/mongoodb-data
* cd into task-manager folder run:
```
npm install
```

## RUNNING
```
env-cmd ./config/dummy_dev.env node index.js
```

### Heroku
You can use Heroku to host your websites
for more information on Heroku please surf to [Heroku Pages](https://dashboard.heroku.com/apps).
make sure you install heroku cli tool  [Heroku Cli Pages](https://devcenter.heroku.com/articles/heroku-cli).

## Mongo Atlas
You can use Mongo Atlas to host your database.
for more information on Atlas please surf to [Mongo Atla](https://www.mongodb.com/cloud/atlas).

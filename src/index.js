//console.log("welcome: index.js")
"use strict";

const app = require('./app')
const mongoose = require('./db/mongoose')
const port = process.env.PORT

if (!process.env.STARTUP_MONGOOSE_DB_ASYNC) process.env.STARTUP_MONGOOSE_DB_ASYNC=YES
if (!process.env.OUTPUT_EXPRESS_HTTP_LOG) process.env.OUTPUT_EXPRESS_HTTP_LOG=YES

const dbconnectcallback = async (status) => {
    
    if (status.connected) return

    if (status.status === 'connecting') return

    server.close(() =>
    {
        console.log("closed: " + status.status + " : " + status.connected)
    })
}

console.log("start up server")
const server = app.listen(port, () =>
{
    console.log('server is up on port ' + port)
})

if (!server)  return
process.env.server = server

if (process.env.STARTUP_MONGOOSE_DB_ASYNC === 'YES') {

    mongoose.connectdb(dbconnectcallback).then(() => {
        dbconnectcallback(mongoose.IsMongooseConnected)
    }).catch((e) => {
        console.log('error happened: ' + e)
    })
}

//console.log("end of line: index.js")

//console.log("welcome: index.js")
"use strict";

const app = require('./app')
const mongoose = require('./db/mongoose')

const { asyncDB, port } = require('./env/env')


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

if (asyncDB === 'YES') {

    mongoose.connectdb(dbconnectcallback).then(() => {
        dbconnectcallback(mongoose.IsMongooseConnected)
    }).catch((e) => {
        console.log('error happened: ' + e)
    })
}

//console.log("end of line: index.js")

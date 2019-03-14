//console.log("welcome: mongoose.js")
"use strict";

const mongoose = require('mongoose')
const app = require('../app')

var IsMongooseConnected =
{
    status: 'init',
    connected: false,
    callback: undefined 
}

mongoose.connection.on('connecting', function(){
    IsMongooseConnected.status  = 'connecting'
    IsMongooseConnected.connected = false
    if (IsMongooseConnected.callback) IsMongooseConnected.callback(IsMongooseConnected)
});

mongoose.connection.on('connected', function() {
    console.log('connected to db')
    IsMongooseConnected.status  = 'connected'
    IsMongooseConnected.connected = true
    if (IsMongooseConnected.callback) IsMongooseConnected.callback(IsMongooseConnected)
});

mongoose.connection.on('error', function(err) {
    console.log('connection to mongo failed ' + err)
    IsMongooseConnected.status  = 'error'
    IsMongooseConnected.connected = false
    if (IsMongooseConnected.callback) IsMongooseConnected.callback(IsMongooseConnected)
});

mongoose.connection.on('disconnected', function() {
    console.log('disconnected to db')
    IsMongooseConnected.status  = 'disconnected'
    IsMongooseConnected.connected = false
    if (IsMongooseConnected.callback) IsMongooseConnected.callback(IsMongooseConnected)
})


const connectdb = async (callback) =>
{   

    if (callback) IsMongooseConnected.callback = callback
    if (IsMongooseConnected.status === 'error') throw new Error('could not connect')

    if (!IsMongooseConnected.connected || IsMongooseConnected.status === 'init') {
        IsMongooseConnected.status = 'trying'
        const options =
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        }

        if (process.env.STARTUP_MONGOOSE_DB_ASYNC === 'YES') {
            mongoose.connect(process.env.MONGODB_URL, options)
        } else {
            await mongoose.connect(process.env.MONGODB_URL, options)
        }
    }
}

/*
 mongoose.connect(process.env.MONGODB_URL,
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then((r) =>
{
    //console.log("connected to mongoose db")

}).catch((e) => 
{
    console.log("connection failed: ", e)

})
*/


module.exports = {
    mongoose,
    IsMongooseConnected,
    connectdb
}

//console.log("end of line: mongoose.js")
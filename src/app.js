//console.log("welcome: app.js")
"use strict";

const express = require('express')

//connects to mongoose db
require('./db/mongoose')

// include the router end points
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

// maintance mode middleware
//app.use((req, res, next) =>
//{
//    res.status(503).send('server undergoing maintance')
//});

// auth middleware
/*
app.use((req, res, next) =>
{
    if (req.method === 'GET') {
        res.send('GET requests are disabled')
    } else {
        next()
    }
});
*/


if (process.env.OUTPUT_EXPRESS_HTTP_LOG === 'YES') {
    // logger middleware
    app.use((req, res, next) => {
        var now = new Date().toString();
        var log = `${now}: ${req.method} ${req.url}`;
        console.log(log);
        next();
    });
}

// tells express to parse json
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('*', async (req, res) =>
{
    res.status(500).send('nothing here apart from us chickens')
})
app.post('*', async (req, res) =>
{
    res.status(500).send('nothing here apart from us chickens')
})
app.delete('*', async (req, res) =>
{
    res.status(500).send('nothing here apart from us chickens')
})
app.patch('*', async (req, res) =>
{
    res.status(500).send('nothing here apart from us chickens')
})
module.exports = app

//console.log("end of line: app.js")
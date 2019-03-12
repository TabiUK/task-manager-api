console.log("welcome: index.js")

const express = require('express')

//connects to mongoose db
require('./db/mongoose')

// include the router end points
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

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

// logger middleware
app.use((req, res, next) =>
{
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    next();
});

// tells express to parse json
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

console.log("start up server")
app.listen(port, () =>
{
    console.log('server is up on port ' + port)
})


console.log("end of line: index.js")

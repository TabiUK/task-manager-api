console.log("welcome: mongoose.js")

const mongoose = require('mongoose')


console.log("connecting mongoose db")
mongoose.connect(process.env.MONGODB_URL,
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then((r) =>
{
    console.log("connected to mongoose db")

}).catch((e) => 
{
    console.log("connection failed: ", e)

})

module.exports = mongoose

console.log("end of line: mongoose.js")

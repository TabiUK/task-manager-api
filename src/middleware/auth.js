console.log("welcome: middleware/auth.js")

const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) =>
{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) throw Error()

        req.token = token
        req.user = user
        next()

    } catch (e) {
        res.status(401).send({ error: 'Please auth'})
    }
}

module.exports = auth

console.log("end of line: middleware/auth.js")

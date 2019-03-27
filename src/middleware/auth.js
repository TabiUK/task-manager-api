//console.log("welcome: middleware/auth.js")
"use strict";

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { jwt_key } = require('../env/env')

const auth = async (req, res, next) =>
{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, jwt_key)
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

//console.log("end of line: middleware/auth.js")

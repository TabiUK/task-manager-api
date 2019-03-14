//console.log("welcome: models/user.js")
"use strict";

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema(
{
    name: 
    {
        type: String,
        required: true,
        trim: true
    },
    email : 
    {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value)
        {
            if (!validator.isEmail(value)) throw new Error('email is not valid')
        }
    },
    age:
    {
        type: Number,
        default: 0,
        validate(value)
        {
            if (value < 0) throw new Error('Age must be positive number')
        }
    },
    password:
    {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'Too few charaters'],
        validate(value)
        {
            if (value.toLowerCase().includes('password')) throw new Error('can not use password as password!')
        }
    },
    tokens: [
        {
            token:
            {
              type: String,
              required: true
            }
        }],
    avatar: {
        type: Buffer
    }
},
{
    timestamps: true
})

userSchema.virtual('tasks',
{
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function ()
{
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '1 day'})
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.methods.toJSON = function ()
{
    const user = this

    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.findByCredentials = async (email, password) =>
{
    if (!email || !password) throw new Error('Unable to login')

    const user = await User.findOne({ email })
    if (!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to login')

    return user
}


// Has the plain text password before saving
userSchema.pre('save', async function (next) 
{
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// delete users taks when user is removed
userSchema.pre('remove', async function (next) 
{
    const user = this

    await Task.deleteMany({
        owner: user._id
    })

    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User

//console.log("end of line:  models/user.js")

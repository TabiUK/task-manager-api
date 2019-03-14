const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const dbmongoose = require('../../src/db/mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId}, process.env.JWT_SECRET_KEY)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
    _id: userTwoId,
    name: 'Jame',
    email: 'jame@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId}, process.env.JWT_SECRET_KEY)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "first task",
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "second task",
    completed: true,
    owner: userOne._id
}


const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Thrid task",
    completed: true,
    owner: userTwo._id
}


const setupDatabase = async () =>
{
    await dbmongoose.connectdb()

    await User.deleteMany()
    await Task.deleteMany()

    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setupDatabase,
    taskOne,
    taskTwo,
    taskThree
}
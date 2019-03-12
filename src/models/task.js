console.log("welcome: models/task.js")

const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
    {
        description:
        {
            type: String,
            trim: true,
            required: true
        },
        completed:
        {
            type: Boolean,
            default: false
        },
        owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
}, {
    timestamps: true
})


TaskSchema.pre('save', async function (next) 
{
    const task = this
    console.log("task pre save")

    next()
})

const Task = mongoose.model('task', TaskSchema)

module.exports = Task

console.log("end of line: models/task.js")

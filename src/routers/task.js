//console.log("welcome: routers/task.js")
"use strict";

const express = require('express')

// include the models we will use
const Task = require('../models/task')
const auth = require('../middleware/auth')

// utils
const Utils = require('../utils/utils')

// create a new express router
const router = new express.Router()

module.exports = router

// setup up end point

// creating new task for user
router.post('/tasks', auth, async (req, res) =>
{
    const task = new Task(
        {
            ...req.body,
            owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:(asc/desc)
// -1 == decending, 1 == acending
// gets all tasks for user
router.get('/tasks', auth, async (req, res) =>
{
    const match = {}
    if (req.query.completed) match.completed = req.query.completed  === 'true'
    if (req.query.limit < 0 || req.query.limit > 1000) req.query.limit = 3
    if (req.query.skip < 0) req.query.skip = 0

    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try {
        //const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate(
            {
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send('' + e)
    }
})


// gets a task based on id for user
router.get('/tasks/:id', auth, async (req, res) =>
{

    const _id = req.params.id

    try {
        const task = await Task.findOne(
            {
                _id,
                owner: req.user._id
        })
    
        if (!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


// update task id for user
router.patch('/tasks/:id', auth, async (req, res) =>
{
    const _id = req.params.id

    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const checkOperation = Utils.isValidOperation(updates, allowedUpdates);
    if (checkOperation.error) return res.status(404).send(checkOperation.error)

    try {

        const task = await Task.findOne(
            {
            _id,
            owner: req.user._id
        })
        if (!task) return res.status(404).send('error not found')

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(500).send('' + e)
    }
})


//delete task id for user
router.delete('/tasks/:id', auth, async (req, res) =>
{
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete( {
            _id,
            owner: req.user._id})

        if (!task) return res.status(404).send('error task not found')

        res.send(task)

    } catch (e) {
        res.status(400).send('' + e)
    }
})

module.exports = router

//console.log("end of line: routers/task.js")

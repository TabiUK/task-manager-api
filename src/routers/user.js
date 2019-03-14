//console.log("welcome: routers/user.js")
"use strict";

const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

// include the models we will use
const User = require('../models/user')

// utils
const Utils = require('../utils/utils')

const auth = require('../middleware/auth')

// create a new express router
const router = new express.Router()

// setup up end point

// create user and login
router.post('/users', async (req, res) =>
{
    const user = new User(req.body)
    try {
      await user.save()
      sendWelcomeEmail(user.email, user.name)
      const token = await user.generateAuthToken()
      res.status(201).send( { user, token } )
    } catch (e) {
      res.status(400).send('' + e)
    }

})


// login user
router.post('/users/login', async (req, res) =>
{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (e) {
        res.status(400).send('' + e)
    }
})

// logout user
router.post('/users/logout', auth, async (req, res) =>
{
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.status(200).send('logged out')
    } catch (e) {
        res.status(500).send('' + e)
    }
})


// logout all users
router.post('/users/logoutAll', auth, async (req, res) =>
{
    try {
        req.user.tokens = []

        await req.user.save()
        res.status(200).send('All logged out')
    } catch (e) {
        res.status(500).send('' + e)
    }
})

// get users profile
router.get('/users/me', auth, async (req, res) =>
{
    res.send(req.user)
})

// update user
router.patch('/users/me', auth, async (req, res) =>
{   
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const checkOperation = Utils.isValidOperation(updates, allowedUpdates);
    if (checkOperation.error) return res.status(404).send(checkOperation.error)

    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send(req.user)

    } catch (e) {
        res.status(400).send('' + e)
    }
})

// delete user
router.delete('/users/me', auth, async (req, res) =>
{    
    try {
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)

    } catch (e) {
        res.status(400).send('' + e)
    }
})


// setup multer
const upload = multer({
    limits: {
        fileSize: 1000000 //1mb
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) return cb(new Error ('files must be a jpg or png'))

        cb(undefined, true)
    }
})

// upload avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) =>
{
    var buffer = undefined
    try {
      buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    } catch (e) {
        return res.status(400).send( {error: 'no avatar'})
    }

    req.user.avatar = buffer

    await req.user.save()
    res.send()
}, (error, req, res, next) =>
{

    res.status(400).send( { error: error.message } )
})

// delete avatar
router.delete('/users/me/avatar', auth, async (req, res) =>
{
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) =>
{

    res.status(400).send( { error: error.message } )
})

// get avatar
router.get('/users/:id/avatar', async (req, res) =>
{
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) throw new Error('no image')

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send('' + e)
    }
})


module.exports = router

//console.log("end of line: routers/user.js")

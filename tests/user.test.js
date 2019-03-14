const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const dbmongoose = require('../src/db/mongoose')
const mongoose = require('mongoose')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)

afterEach(() =>
{
    //console.log('afterEach')
})

test('Should signup a new user', async () => 
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    const response = await request(app).post('/users').send(
        {
            name: 'Nick',
            email: 'thedimbar@gmail.com',
            password: '1234567890'
        }).expect(201)
    
    // assert that the database was chaged correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // assertions about the response
    expect(response.body).toMatchObject(
        {
            user: {
                name: 'Nick'
            },
            token: user.tokens[0].token
        }
    )

    expect(user.password).not.toBe(userOne.password)
})


test('should login existing user', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

     // assert that the database was chaged correctly
     const user = await User.findById(userOneId)
     expect(user).not.toBeNull()

      // assertions about the response
    expect(response.body).toMatchObject(
        {
            token: user.tokens[1].token
        }
    )
})

test('should not login nonexist user', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'userOne.password'
    }).expect(400)
})


test('Should get profile for user', async () => {
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not het profile for unauth user', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete account for user', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
     expect(user).toBeNull()
})


test('should not delete account for unauth user', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('should upload avator image', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Fred'
    })
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Fred')

})

test('Should NOT update INVALID user fields', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'Cyprus'
    })
    .expect(404)

    const user = await User.findById(userOneId)
    expect(user.location).toEqual(undefined)

})

test('should disconnect from db', async () =>
{
    await mongoose.disconnect()
    expect(dbmongoose.IsMongooseConnected.connected).toEqual(false)

})

// TODO

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated
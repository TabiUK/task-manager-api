const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const mongoose = require('mongoose')
const dbmongoose = require('../src/db/mongoose')


const {  
    userOne,
    userOneId,
    userTwo,
    userTwoId, 
    setupDatabase, 
    taskOne,
    taskTwo,
    taskThree
 } = require('./fixtures/db')


beforeEach(setupDatabase)

test('should create task for user', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'from my test'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()

    expect(task.completed).toEqual(false)

})


test('should get all tasks for user', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toEqual(2)
})


test('should NOT be able to delete another users task', async () =>
{
    expect(dbmongoose.IsMongooseConnected.connected).toBeTruthy()

    const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()

})


test('should disconnect from db', async () =>
{
    await mongoose.disconnect()
    expect(dbmongoose.IsMongooseConnected.connected).toEqual(false)

})

// TODO

// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks
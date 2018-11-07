

const {app} = require('../server');
const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');
const assert = require('assert');

const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


describe('Server', () => {
    beforeEach(populateUsers);
    beforeEach(populateTodos);
    // test - create a new todo 
    describe('#POST/todos', () => {
        it('should create a new todo', (done) => {
            var text = 'Todo Test';
            request(app)
            .post('/todos')
            .send({'text': text})
            .set('Accept', 'application/json')
            .expect(200)
            .expect((res)=> {
               expect(JSON.parse(res.text).text).toBe( text);
            })
            .end((err,res)=> {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    for(let i=0;i<todos.length;i++) {
                        expect(todos[i].text).toBe(text);
                    }
                    done();
                }).catch((e)=>done(e));
            });
        });
        it('should create a todo with invalid data', (done) => {
            request(app)
            .post('todos')
            .send({})
            .expect(404)
            .end((err, res)=> {
                if(err) {
                    return done(err);
                }
                Todo.find({}).then((todos)=> {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=>done(e));
            });
        });
    });    
    describe('#GET/todos', () => {
        it('should get all the todos', (done) => {
            request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.length).toBe(2);
            });
            done();
        });
    });
    describe('#GET/todos/:id', () => {
        it('should return todo doc', (done) => {
            request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(JSON.parse(res.text).todos.text).toBe(todos[0].text);
            })
            .end((err,res)=> {
                if(err) {
                    return done(err);
                }
                done();
            });
        });
        it('should return a 404 if todo not found', (done) => {
            request(app)
            .get(`/todos/${todos[0]._id.toHexString()}1`)
            .expect(404)
            .end(done);
        });
        it('should return 404 for non-object ids', (done) => {
            request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
        });
    });
    describe('#DELETE/todos/:id', () => {
        it('should remove a todo with id', (done) => {
            var id = todos[1]._id.toHexString();
             request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res)=> {
                expect(JSON.parse(res.text).todos._id).toBe(id);
            })
            .end((err,res)=> {
                if(err) {
                    return done(err);
                }
                Todo.findById(id).then((todos)=>{
                    expect(todos).toBeNull();
                    done();
                }).catch((e)=> done(e));
            });
        });
        it('should return 404 if todo not found', (done) => {
            var id = new ObjectID().toHexString();
            request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
        });
        it('should return 404 if object id is invalid', (done) => {
            request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
        });
    });

    describe('#PATCH/todos/:id', () => {
        it('should update the todo', (done) => {
            //grab id of first item
            var id = todos[0]._id.toHexString();
            //update text, set completed true
            var text = "text updated throught mocha";
            request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text
            })
            //200
            .expect(200)
            //text is changed, completed is true, completedAt is a number
            .expect((res)=> {
                expect(JSON.parse(res.text).text).toBe(text);
                expect(JSON.parse(res.text).completed).toBeTruthy();
                expect(typeof JSON.parse(res.text).completedAt).toBe('number');
            })
            .end(done);
        });
        it('should clear completedAt when todo is not completed', (done) => {
            //grab id of second item
            var id = todos[1]._id.toHexString();
            //update text, set completed false
            var text = "text updated throught mocha";
            request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: false,
                text,
            })
            //200
            .expect(200)
            //text is changed, completed is false, completedAt is null
            .expect((res)=> {
                // console.log('JSON.parse(res.text).completedAt :', res.body);
                expect(JSON.parse(res.text).text).toBe(text);
                expect(JSON.parse(res.text).completed).toBeFalsy();
                expect(JSON.parse(res.text).completedAt).toBeNull();
            })
            .end(done);
        });
    });

    describe('#GET/users/me', () => {
        it('should return user if authenticated', (done) => {
            request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                assert.deepStrictEqual(res.body._id, users[0]._id.toHexString());
                assert.deepStrictEqual(res.body.email, users[0].email);
            })
            .end(done);
        });
        it('should return 401 if not authenticated', (done) => {
            request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                assert.deepStrictEqual(res.body, {});
            })
            .end(done);
        });
    });

    describe('#POST/users', () => {
        it('should create user', (done) => {
            var email = 'abc@abc.com';
            var password ='abc123';
            request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.header['x-auth']).toBeDefined();
                expect(res.body._id).toBeDefined();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if(err) {
                    return done(err);
                }

                User.findOne({email}).then((user)=>{
                    expect(user).toBeDefined();
                    expect(user.password).not.toBe(password);
                    done();
                });

            });
        });
        it('should return validation errors if request invalid', (done) => {
            var email='and';
            var password = 'pass123';
            request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done);
        });
        it('should not create user if email exists', (done) => {
            var email=users[0].email;
            var password = 'pass123';
            request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done);
        });
    });
});


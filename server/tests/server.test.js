

const {app} = require('../server');
const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

/**
 * Import 
 * source: config files
 * dtart
 */
var {PORT} = require('../config/config.test');
var {MONGODB_URI} = require('../config/config.test');
 /**
 * Import 
 * source: config files
 * end
 */
const {Todo} = require('../models/todo');

const todos = [
    {
        _id : new ObjectID(),
        text : 'this is first todo'
    },
    {
        _id : new ObjectID(),
        text : 'this is second todo'
    }
];

describe('Server', () => {
    beforeEach((done) => {
        // Todo.remove({}).then(() => done()); ---------- depecreated
        Todo.deleteMany({}).then(()=> {
            return Todo.insertMany(todos);
        }).then(()=> done());
    });
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
            .end(done);
        });
        it('should return a 404 if todo not found', (done) => {
            request(app)
            .get(`todos/${todos[0]._id.toHexString()}`)
            .expect(404)
            .end(done);
        });
        it('should return 404 for non-object ids', (done) => {
            request(app)
            .get('todos/123')
            .expect(404)
            .end(done);
        });
    });
   /*  describe('#DELETE/todos/:id', () => {
        it('should remove a todo with id', (done) => {
            var id = todos[1]._id.toHexString();
            return request(app)
            .delete(`todos/${id}`)
            .expect(200)
            .expect((res)=> {
                console.log('res :', JSON.parse(res, undefined, 2));
                expect(JSON.parse(res.text).todos._id).toBe(id);
            })
            .end((err,res)=> {
                if(err) {
                    return done(err);
                }
                Todo.findById(id).then((todos)=>{
                    expect(todo).toNotExist();
                    done();
                }).catch((e)=> done(e));
            });
        });
        it('should return 404 if todo not found', (done) => {
            var id = new ObjectID().toHexString();
            request(app)
            .delete(`todos/${id}`)
            .expect(404)
            .end(done);
        });
        it('should return 404 if object id is invalid', (done) => {
            request(app)
            .delete('todos/123')
            .expect(404)
            .end(done);
        });
    }); */

    describe('#PATCH/todos/:id', () => {
        it('', () => {
            
        });
        it('', () => {
            
        });
    });
});


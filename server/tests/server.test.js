

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
            .send({text})
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
    });    
});


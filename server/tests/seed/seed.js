
const {ObjectID} = require('mongodb');
const jwt  = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [
    {
        _id: userOneID,
        email: 'andrew@example.com',
        password: 'userOnepass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userOneID.toHexString(), access: 'auth'}, 'abc123').toString()
            }
        ]
    },
    {
        _id: userTwoID,
        email: 'andrew1@example.com',
        password: 'userTwoPass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userTwoID.toHexString(), access: 'auth'}, 'abc123').toString()
            }
        ]
    }
];
const todos = [
    {
        _id : new ObjectID(),
        text : 'this is first todo'
    },
    {
        _id : new ObjectID(),
        text : 'this is second todo',
        completed: true,
        completedAt: 333
    }
];

const populateTodos = (done) => {
    // Todo.remove({}).then(() => done()); ---------- depecreated
    Todo.deleteMany({}).then(()=> Todo.insertMany(todos)).then(()=> done());
};

const populateUsers = (done) => {
    User.deleteMany({}).then(()=> {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne,userTwo])
    }).then(()=> done());
};

module.exports = {todos, populateTodos, users, populateUsers};
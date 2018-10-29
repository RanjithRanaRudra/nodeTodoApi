
/**
 * Import 
 * source: config files
 * dtart
 */
// require('./config/config');
var {PORT} = require('./config/config');
var {MONGODB_URI} = require('./config/config');
 /**
 * Import 
 * source: config files
 * end
 */

/**
 * Import 
 * source: 3rd Party & Native Libraries
 * start
 */
const _ = require('lodash');
const express = require('express');
const body_parser = require('body-parser');
const { ObjectID } = require('mongodb');

/**
 * Import 
 * source: 3rd Party & Native Libraries
 * end
 */

 /**
  * Import
  * source: same  or other Project Files
  * start
  */
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

/**
  * Import
  * source: same  or other Project Files
  * end
  */

var app = express();

var port = process.env.PORT;

app.use(body_parser.json());

app.get('/', (req, res)=> {
    res.send('Hello World')
});

// post a new todo record in TOdo App
app.post('/todos', (req, res)=> {
    var todo = new Todo({
        text: req.body.text
    });
    //saving the todo model
    todo.save().then((doc) => {
        res.status(200).send(JSON.stringify(doc, undefined,2));
    }).catch((err) => {
        res.status(400).send(err);
    });
});

// get all todos from TodoApp
app.get('/todos', (req,res)=>{
    Todo.find().then((todos)=>{
        res.status(200).send(todos);
    }).catch((err)=> res.status(400).send(err));
});

// get todos by id from TodoApp
app.get('/todos/:id', (req,res)=>{
    var id = req.params.id;
    //  Id Vaidation
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    //getting result
    Todo.findById(id).then((todos)=> {
        if(!todos) {
            res.status(404).send();
        }
        res.send(JSON.stringify({todos}, undefined, 2));
    }).catch((err)=> res.status(400).send(err));
});

// deleting a todo by id from TodoApp
app.delete('/todos/:id', (req, res)=> {
    var id = req.params.id;
    // Id Validation
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    // Delete the record by id
    Todo.findByIdAndDelete(id).then((todos)=>{
        if(!todos) {
            res.status(404).send();
        }
        res.status(200).send(JSON.stringify({todos}, undefined, 2));
    }).catch((e)=> res.status(400).send(e));
});

//updating a todo by id to TodoApp
app.patch('/todos/:id', (req, res)=> {
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);
    //Id Validation
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    //check completed condition and updating completed At and completed states
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }
    // Updating the record by id
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todos)=> {
        res.status(200).send(todos);
    }).catch((e)=> res.status(400).send(e));
});

// post a new user in todoApp
app.post('/users', (req, res)=> {
    var body = _.pick(req.body,['email', 'password']);
    //posting the data to model 
    var user = new User(body);
    //saving userdata to TodoApp
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=> res.status(400).send(e));
});

app.listen(port, ()=> {
    console.log(`Server is running on port : ${port}`);
});

module.exports = {app};
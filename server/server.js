
var express = require('express');
var body_parser = require('body-parser');
var { ObjectID } = require('mongodb');


var { db } = require('./db/mongoose');
var { Todo } = require('./models/todo');

var app = express();

app.use(body_parser.json());

var port = process.env.PORT || 3000;
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

app.listen(port, ()=> {
    console.log(`Server is running on port : ${port}`);
});
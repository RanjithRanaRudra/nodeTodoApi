
var express = require('express');
var body_parser = require('body-parser');

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

app.listen(port, ()=> {
    console.log(`Server is running on port : ${port}`);
})

var express = require('express');
var body_parser = require('body-parser');

var {mongoose} = require('./db/mongoose');

var app = express();

app.use(body_parser.json());

var port = process.env.PORT || 3000;
app.get('/', (req, res)=> {
    res.send('Hello World')
});

app.listen(port, ()=> {
    console.log(`Server is running on port : ${port}`);
})
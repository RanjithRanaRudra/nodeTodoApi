
var mongoose = require('mongoose');

var todo_schema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 5
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number
    }
  });

  var todo_model = mongoose.model('Todo', todo_schema);

  module.exports ={Todo: todo_model};
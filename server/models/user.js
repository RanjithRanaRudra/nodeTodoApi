const mongoose = require('mongoose');
const validator = require('validator');

var user_schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength:1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength:6
    },
    tokens: [{
        access: {
    type: String,
    required: true            
        },
        token: {
            type: String,
            required: true
        }
    }]
});

var user_model = mongoose.model('User', user_schema);

module.exports = {User: user_model};
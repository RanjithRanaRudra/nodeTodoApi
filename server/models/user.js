const mongoose = require('mongoose');
const validator = require('validator');
const jwt  = require('jsonwebtoken');
const _ = require('lodash');

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
//choosing  display contents of user
user_schema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}
// generation of  jwt token 
user_schema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(()=> {
        return token;
    });
};
var user_model = mongoose.model('User', user_schema);

module.exports = {User: user_model};
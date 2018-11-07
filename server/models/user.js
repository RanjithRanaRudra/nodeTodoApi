const mongoose = require('mongoose');
const validator = require('validator');
const jwt  = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
user_schema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    }
    catch(e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};
user_schema.pre('save', function(next) {
    var user =this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(user.password, salt, (err, hash)=> {
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
var user_model = mongoose.model('User', user_schema);

module.exports = {User: user_model};
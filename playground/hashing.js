const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = "password!";
var hashed;
bcrypt.genSalt(10, (err, salt)=> {
    bcrypt.hash(password, salt, (err, hash)=> {
        hashed = hash;
        console.log('hashed :', hashed);
        console.log('hashed :', typeof hashed);
    });
});
var hashedPassword = '$2a$10$PZad7WETk7vOpDCruHBn4OOd5rTn2zWILXLtbO9TUJlpiUjNDwoI.';
bcrypt.compare(password, hashedPassword, (err,res)=> {
    console.log('res : ', res);
})

/* var data = {
    id: 10
};

var token = jwt.sign(data, '123abc');
console.log(`token : ${token}`);
var decoded = jwt.verify(token, '123abc');
console.log('decoded token : ',decoded); */

/* var message = "I am user number 3";
var hash = SHA256(message).toString();

console.log(`message : ${message}`);
console.log(`hash : ${hash}`); */
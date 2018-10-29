const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = "123abc!";
var hashed;
bcrypt.genSalt(10, (err, salt)=> {
    bcrypt.hash(password, salt, (err, hash)=> {
        hashed = hash;
        console.log('hashed :', hashed);
        console.log('hashed :', typeof hashed);
    });
});
var hashedPassword = '$2a$10$Iz7pGgOXgPfjqqLwhNF85eIyfK4GDKe09s59W6y87Wrn8LT/jrWLq';
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
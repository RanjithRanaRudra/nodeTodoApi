var env = process.env.NODE_ENV || 'test';
console.log('env ******', env);
switch(env) {
    case 'development' :
        process.env.PORT = 3000;
        process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
        break;
    case 'test' :
        process.env.PORT = 3001;
        process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
        break;
}

var PORT = process.env.PORT;
var MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
    PORT,
    MONGODB_URI
}
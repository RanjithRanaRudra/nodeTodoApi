/**
 * Import 
 * source: config files
 * dtart
 */
var {PORT} = require('../config/config');
var {MONGODB_URI} = require('../config/config');
 /**
 * Import 
 * source: config files
 * end
 */

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

/* var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log('Connected');
}); */

module.exports = { mongoose };

// db.close();
// server.js
// Tutorial URL: http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4


// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 			// define our app using express
var bodyParser = require('body-parser');
var path       = require('path');
//connect to DataBase
//define schemas, other stuff to make DB useable

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine','html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'views')));
var port = process.env.PORT || 80; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var login = require('./routes/login.js');
var trips = require('./routes/trips.js');
app.use(login);
app.use(trips);

//this should fire every single time there is a request
//router.use(function(req, res, next) {
	// do logging
//	console.log('Something is happening.');
//	next(); // make sure we go to the next routes and don't stop here
//});



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

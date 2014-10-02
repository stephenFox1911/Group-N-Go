// server.js
// Tutorial URL: http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4


// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');

//connect to DataBase
//define schemas, other stuff to make DB useable

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

//this should fire every single time there is a request
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

router.route('/Users')

	// create a User (accessed at POST http://localhost:8080/api/Users)
	.post(function(req, res) {
		
		//create the user here
		console.log('Creating User');

		res.json({ message: 'Bear created!' });
	});
		
	// get all the Users (accessed at GET http://localhost:8080/api/Users)
	.get(function(req, res) {
		//return all of the users
		console.log('returning Users');
		res.json(ListofUsers);
	});

router.route('/Users/:user_id')

	.get(function(req, res) {
		//return single user by id
		var ret = somethingSomething;
		res.json(ret);
	});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Hello World!' });	
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
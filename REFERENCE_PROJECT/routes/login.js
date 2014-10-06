var express = require('express');
var rest = require('restler');
var router = express.Router();

var UserDAO = require('../DAO/userDAO').UserDAO;

// define the home page route
router.get('/', function (req, res) {
	res.render('index.html',{requestIP: req.ip});
});

router.post('/register', function (req,res){
	var b = req.body;

	var userDAO = new UserDAO('localhost', 3306);

    userDAO.addUser(b.userName, b.thePassword, function(err, data){
    	if(err){
    		console.log('Error adding user - responding');
    		res.send(err);
    	}
    	else{
		req.session.userName = b.userName;
		req.session.thePassword = b.thePassword;
        	console.log('Added user successfully - responding');
 		res.send("True");
    	}
    });
});

router.post('/login', function (req,res){
	var b = req.body;

	var userDAO = new UserDAO('localhost', 3306);

	userDAO.loginUser(b.userName,b.thePassword, function(err){
		if(err){
			console.log('Could not find the user in DB');
			res.send(err);
		}
		else{
			req.session.userName = b.userName;
			req.session.thePassword = b.thePassword;
			console.log('Successfully found user - logging in');
			res.send("True")
		}
	});

});

router.get('/home', function(req,res){
	// add bunch of rest calls here to get the data for groups/clusters/nodes
	console.log(req.session.userName);
	res.render('userPage.html');
});

router.get('/getClusters', function(req,res){
	userName = req.param.userName;


});

router.post('/addNode', function (req,res){
	b = req.body;
	console.log(b);

	machine_id = b.machine_id;
	source_ip = req.ip;

	var jsonData = {
		userName : b.userName,
		thePassword : b.thePassword,
		sourceNode : b.machine_id,
		ip : req.ip
	};
	
	var userDAO = new UserDAO('localhost', 3306);
	userDAO.loginUser(b.userName,b.thePassword, function(err){
                if(err){
                        console.log('Could not find the user in DB');
			return res.send(err);
			return;
                }
  		else{
			console.log("User validated, Adding node...");
			res.set('validated', "True");		
		}
        });
	if(res.get('validated' === "True")){
	userDAO.addNode(machine_id, source_ip, function(err){
	    if(err){
		console.log(err);
		res.set('error', err);
	    }
	    else{
		console.log("Node Successfully added!");
		res.send({ Added: "Success" });	
	    }
	});
	}
});

module.exports = router;

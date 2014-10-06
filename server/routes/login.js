var express = require('express');
var rest = require('restler');
var crypto = require('crypto');
var router = express.Router();
var UserDAO = require('../DAO/userDAO').UserDAO;

function rand(rlen){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < rlen; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// return angular front end
router.get('/', function(req, res) {
        res.render('app/index.html',{requestIP: req.ip});
});


router.post('/api/users/', function(req, res) {
            //create the user here
	    h = req.headers;
	    if(h.uname == null || h.pass.length < 6){
		console.log('Bad Username or pass');
	    	return res.send( {error: 'Username or password do not meet requirements' });
    	    }
	    if(h.fname == null || h.fname == ""){
		console.log('No First Name');
		return res.send( { error: 'No First Name' });
	    }
	    if(h.lname == null || h.lname == ""){
                console.log('No Last Name');
		return res.send( { error: 'No Last Name' });
            }
            console.log('Creating User');
	    var shasum = crypto.createHash('sha256');
	    var salt = rand(10);
	    shasum.update(salt + h.pass);
	    var jsondata = {
		uname:  h.uname,
	        pass: shasum.digest('hex'),
	        salt: salt,
	        firstname: h.fname,
	  	lastname: h.lname
	    };
            res.send(jsondata);
});

// get user by userid (accessed at GET http://localhost:80/api/users)

router.get('/api/users/:userid', function(req, res) {
	     //return all of the users
             console.log('returning Users');
             b = req.body;
	     res.send(b);
});


module.exports = router;

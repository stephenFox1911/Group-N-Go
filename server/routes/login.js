var express = require('express');
var cookieparser = require('cookieparser');
var rest = require('restler');
var crypto = require('crypto');
var router = express.Router();
var squel = require('squel');
var connection = require('../DAO/connection');
squel.useFlavour('mysql');

function rand(rlen){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_+-=[]{};:<,>.?/";
    for( var i=0; i < rlen; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

// return angular front end
router.get('/', function(req, res) {
        res.render('index.html',{requestIP: req.ip});
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
	    var sql = squel.insert()
		.into("Users")
		.set("Username", h.uname)
		.set("PasswordHash", shasum.digest('hex'))
		.set("Salt", salt)
		.set("FirstName", h.fname)
		.set("LastName", h.lname)
		.toParam();
	    connection.query(sql.text, sql.values, function(err, results){
		if(err){
			console.log("Error Adding user");
			console.log(err)
			res.send({success: 'False', error: err});
		} else {
		    console.log("Added user");
           	    res.send({success: 'True'});
		}
	    });
});

// get user by userid (accessed at GET http://localhost:80/api/users)

router.get('/api/users/', function(req, res) {
	     //return all of the users
             console.log('returning Users');
            var sql = squel.select()
		.field("UserName")
                .from("Users")
		.toString();
            connection.query(sql, function(err, results){
                if(err){
                        console.log(err)
                        res.send({success: 'False', error: err});
                } else {
                    console.log("Added user");
                    return res.json(results);
                }
            });
});

router.post('/api/login/', function(req, res){
    //attempt to login user
    h = req.headers;
    var sql = squel.select()
        .from("Users")
	.field("ID")
        .field("Username")
        .field("PasswordHash")
        .field("Salt")
	.where("Username = ?", h.uname)
	.limit(1)
        .toParam();
    connection.query(sql.text, sql.values, function(err, rows){
	if(err){
            console.log("Error Adding user");
            console.log(err)
            return res.send({success: 'False', error: err});
	} else {
	    var uid = rows[0].ID;
            var salt = rows[0].Salt;
	    var passwrd = rows[0].PasswordHash;
	    var shasum = crypto.createHash('sha256');
	    shasum.update(salt + h.pass);
	    if(shasum.digest('hex') == passwrd){
	        console.log('Logging in user: ' + h.uname);
		res.cookie('userid', uid);
		return res.send({success: 'True'});
	    }
	    else{
		console.log('Invalid Pass');
		return res.send({success: 'False', message: 'passwords do not match'});
	    }
        }
    });
});

module.exports = router;

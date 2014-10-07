var express = require('express');
var rest = require('restler');
var router = express.Router();
var squel = require('squel');
var connection = require('../DAO/connection');
squel.useFlavour('mysql');

// return angular front end
router.get('/', function(req, res) {
        res.render('app/index.html',{requestIP: req.ip});
});

//returns all active trips
router.get('/api/trips/', function(req, res) {
        var sql = squel.select()
            .from("Trips")
            .where("Active = 1")
		.toString();
			connection.query(sql, function(err, results){
	            if(err){
	                console.log(err)
	                res.send({success: 'False', error: err});
	            } else {
	                console.log("Looked up trips");
	                return res.json(results);
	                }
	            });
});

//creates a new trip
router.post('/api/trips/', function(req, res) {
      h=req.headers;

      //start/end with locationID
      //num people
      //num seats

      var sql = squel.insert()
		.into("Trips")
		.set("StartLocationID", h.slocation)
		.set("EndLocationID", h.elocation)
		.toParam();
	    connection.query(sql.text, sql.values, function(err, results){
		if(err){
			console.log("Error Adding trip");
			console.log(err)
			res.send({success: 'False', error: err});
		} else {
		    console.log("Added trip");
           	    res.send({success: 'True'});
		}
	    });
});

module.exports = router;
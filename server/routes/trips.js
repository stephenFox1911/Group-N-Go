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
	    .field("trips.ID")
	    .field("sl.Name", "sname")
	    .field("sl.Lat", "slat")
	    .field("sl.Lng", "slng")
	    .field("el.Name", "ename")
	    .field("el.Lat", "elat")
            .field("el.Lng", "elng")
            .from(squel.select()
		.field("Trips.*")
		.from("Trips")
		.join("Users_Trips", null, "Users_Trips.TripID = Trips.ID AND Users_Trips.Active = 1"), "trips")
            .join("Locations", "sl", "trips.StartLocationID = sl.ID")
            .join("Locations", "el", "trips.EndLocationID = el.ID")
   	    .toString();
	    console.log(sql);
	    connection.query(sql, function(err, results){
	        if(err){
	        	console.log(err)
	                return res.send({success: 'False', error: err});
	        }
		else {
	                console.log("Looked up trips");
			var objs = [];
			for(i=0; i<results.length; i++){
				result = results[i];
				var jsonobj = {
					ID: result.ID,
					slocation : {
						name : result.sname,
						coords : {
							latitude : result.slat,
							longitude : result.slng
						}
					},
					elocation : {
						name : result.ename,
						coords : {
							latitude : result.elat,
							longitude : result.elng
						}
					}
				};
				objs.push(jsonobj);
			}
	       		return res.json(objs);
		}
	    });
});

//creates a new trip
router.post('/api/trips/', function(req, res) {
	h=req.headers;
      	if(h.slocation == null || h.slocation.length<=0 || h.elocation == null || h.elocation.length<=0){
		console.log("Empty Requst");
		return res.send({Success: 'False', Error: err});
	}
        //get current userID from cookie
        var curruser = 1;
	//start/end with locationID
        //num people
        //num seats
	
      var sql = squel.insert()
		.into("Trips")
		.set("StartLocationID",
			squel.select()
			.field("ID")
			.from("Locations")
			.where("UPPER(Name) like ?","%"+h.slocation.toUpperCase()+"%")
			.limit(1)
		)
		.set("EndLocationID",
			squel.select()
			.field("ID")
			.from("Locations")
			.where("UPPER(Name) like ?", "%"+h.elocation.toUpperCase()+"%")
			.limit(1)
		)
		.toString();
//	    console.log(sql);
	    connection.query(sql, function(err, results){
		if(err){
			console.log("Error Adding trip");
			console.log(err)
			return res.send({success: 'False', error: err});
		}
		else{
			var tripid = results.insertId;
			var utsql = squel.insert()
                        .into("Users_Trips")
                        .set("UserID", curruser)
                        .set("TripID", tripid)
                        .toString();
                    connection.query(utsql, function(err, results){
                        if(err){
                            console.log(err);
                            return res.send({Success: 'False', Error: err});
                        }
                        else{
                            console.log("Added Trip");
                            return res.send({Success: 'True'});
                        }
                    });
		}
	    });
});

module.exports = router;

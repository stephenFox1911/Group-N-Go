var express = require('express');
var rest = require('restler');
var router = express.Router();
//var cookies = require('./cookies');
var squel = require('squel');
var connection = require('../DAO/connection');
squel.useFlavour('mysql');

// return angular front end
router.get('/', function(req, res) {
        res.render('app/index.html',{requestIP: req.ip});
});

router.get('/api/close/', function(req,res){
	var sloc = req.query.slocation;
	var sql = squel.select()
		.field("Locations.Lat")
		.field("Locations.Lng")
		.from("Locations")
		.where("UPPER(Locations.Name) like ?", "%" + sloc.toUpperCase() + "%")
		.limit(1)
		.toString();
	connection.query(sql, function(err, result){
		if(err || result.length <1){
			if(err){
				console.log(err);
				return res.send({Success: 'False', Error: err});
			}
			else{
				console.log("No Such Location");
				return res.send({Success: 'False', Error: 'No Such Location'});
			}
		}
		else{
			var closest = squel.select()
				.field("close.tripid")
				.field("close.sname")
				.field("close.slat")
				.field("close.slng")
				.field("close.ename")
				.field("close.elat")
				.field("close.elng")
				.field("(POW(69.1 * (close.slat -" + result[0].Lat + "), 2) + POW(69.1 * (" + result[0].Lng + "- close.slng) * COS(close.slat / 57.3), 2))", "distance")
				.from(squel.select()
					.distinct()
					.field("trips.TripID","tripid")
					.field("sl.Name", "sname")
					.field("sl.Lat", "slat")
					.field("sl.Lng", "slng")
					.field("el.Name", "ename")
                                        .field("el.Lat", "elat")
                                        .field("el.Lng", "elng")
					.from(squel.select()
						.field("TripID")
						.from("Users_Trips")
						.where("Active = 1")
						, "trips"
					)
					.join("Trips","t", "trips.TripID = t.ID")
					.join("Locations", "sl", "sl.ID = t.StartLocationID")
					.join("Locations", "el", "el.ID = t.EndLocationID")
					,"close"
				)
				.order("distance")
				.toString();
			//console.log(closest);
			connection.query(closest, function(err, results){
				if(err){
					console.log(err);
					return res.send(err);
				}
				else{
					console.log("Looked up closest trips");
					var objs = [];
					for(i=0; i<results.length; i++){
                                		resu = results[i];
                                		var jsonobj = {
                                        		ID: resu.tripid,
                                        		slocation : {
                                        	        	name : resu.sname,
                                                		coords : {
                                                        	latitude : resu.slat,
                                                        	longitude : resu.slng
                                                		}
                                        		},
                                        		elocation : {
                                                		name : resu.ename,
						 		coords : {
                                                        		latitude : resu.elat,
                                                        		longitude : resu.elng
                                                		}
                                        		}
                                		};
                                		objs.push(jsonobj);
                        		}
                        		return res.json(objs);
				}
			});
		}
	});
});


//returns all active trips
router.get('/api/trips', function(req, res) {
        var sql = squel.select()
	    .distinct()
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
//	    console.log(sql);
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

//Get all members of a specific trip
router.get('/api/trips/:id', function(req, res){
	var tripid = req.params.id;
	var sql = squel.select()
		.field("Users.ID")
		.field("Users.UserName")
		.field("Users.FirstName")
		.field("Users.LastName")
		.from(squel.select()
			.field("Users_Trips.UserID")
			.from("Users_Trips")
			.where("Users_Trips.Active = 1 AND Users_Trips.TripID = ?", tripid), "userids")
		.join("Users", "", "userids.UserID = Users.ID")
		.toString();
	console.log(sql);
	connection.query(sql, function(err, results){
		if(err){
			return res.send(err);
		}
		else{
			return res.json(results);
		}
	});
});

//creates a new trip
router.post('/api/trips/', function(req, res) {
	h=req.headers;
      	if(h.slocation == null || h.slocation.length<=0 || h.elocation == null || h.elocation.length<=0){
		console.log("Empty Requst");
		return res.send({Success: 'False', Error: 'Empty Request'});
	}
	if(h.cuc == null || h.cuc.length<=10){
		console.log("bad user");
		if(h.cuc != null){
			console.log(h.cuc.length);
			console.log(h.cuc);
		}
		return res.send({Success: 'False', Error: "Invalid user"});
	}
        //get current userID from cookie
        var curruser = parseInt(h.cuc.substring(10));
	console.log(curruser);
	leaveTrips(curruser);

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
//		    console.log(utsql);
                    connection.query(utsql, function(err, results){
                        if(err){
			    console.log("error mapping to users_trips");
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

//join a trip

router.post('/api/trips/:id', function(req, res){
	var tripid = req.params.id;
	var h = req.headers;
	if(h.cuc == null || h.cuc.length<=10){
                console.log("bad user");
                if(h.cuc != null){
                        console.log(h.cuc.length);
                        console.log(h.cuc);
                }
                return res.send({Success: 'False', Error: "Invalid user"});
        }
	var curruser = parseInt(h.cuc.substring(10));
	leaveTrips(curruser);
	var sql = squel.insert()
		.into("Users_Trips")
		.set("UserID", curruser)
		.set("TripID", tripid)
		.toString();
	connection.query(sql, function(err, results){
		if(err){
			return res.send(err);
		}
		else{
			return res.send({Success: 'True'});
		}
	});
});

//leave a trip
router.delete('/api/trips/', function(req, res){
	var h = req.headers;
	if(h.cuc == null || h.cuc.length<=10){
                console.log("bad user");
                if(h.cuc != null){
                        console.log(h.cuc.length);
                        console.log(h.cuc);
                }
                return res.send({Success: 'False', Error: "Invalid user"});
        }	
	var curruser = parseInt(h.cuc.substring(10));
	leaveTrips(curruser);
});

function leaveTrips(userID){
	var sql = squel.update()
		.table("Users_Trips")
		.set("Active", 0)
		.where("UserID = ?", userID)
		.toString();
	console.log(sql);
	connection.query(sql, function(err, results){
		if(err){
			return res.send(err);
		}
	});
};

module.exports = router;

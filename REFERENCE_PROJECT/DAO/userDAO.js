var mysql = require('mysql');
var squel = require('squel');
squel.useFlavour('mysql');

// creates a class which will be used to interface with the userData collection
UserDAO = function(host, port) {
    this.pool = mysql.createPool({
        host     : host,
        user     : 'root',
        password : 'admin',
        database : 'crowdcomputing',
        port: port,
        typeCast: function (field, next){
            // handle all BIT(1) fields as 0 or 1
            if (field.type == 'BIT' && field.length == 1){
                var bit = field.string();

                return (bit === null) ? null : bit.charCodeAt(0);
            }

            return next();
        }
    });
};

UserDAO.prototype.getConnection = function(callback) {
    this.pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

UserDAO.prototype.addUser = function(userName, thePassword, callback) {

    this.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            var sql =
                squel.insert()
                    .into("users")
                    .set("userName", userName)
                    .set("thePassword", thePassword)
                    .toParam();

            connection.query(sql.text, sql.values, function(err, results){
                connection.release();
                if(err){
                    console.log("Error Adding: " + userName + ' - ' + thePassword);
                    callback(err);
                } else {
		    console.log("Added: " + userName + ' - ' + thePassword);
                    callback(null);
                }
            });


        }
    });
};

UserDAO.prototype.loginUser = function(userName, thePassword, callback) {

    this.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            var sql =
                squel.select()
                    .from("users")
                    .field("users.userName")
                    .field("users.thePassword")
                    .where("users.userName = \"" + userName + "\"")
                    .where("users.thePassword = \"" + thePassword + "\"")
                    .toString();

            console.log(sql);

            connection.query(sql, function(err){
                connection.release();
                console.log(results);
                if(err || results.length===0 ){
                    console.log("Error Finding: " + userName + ' - ' + thePassword);
		    err = "No such user."
                    callback(err);
                } else {
                    console.log("Found: " + userName + ' - ' + thePassword);
                   callback(null);
                }
            });
        }
    });
};

UserDAO.prototype.findClusters = function(userName,callback) {

    this.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            var sql =
                squel.select('*')
                    .from("clusters")
                    .join("user_cluster", "clusters", "clusters.cluster_id = user_cluster.cluster_id")
                    .where("users.userName = \"" + userName + "\"")
                    .toString();

            connection.query(sql.text, function(err, results){
                connection.release();
                if(err){
                    console.log("Error Finding Clusters for: " + userName);
                    callback(err);
                } else {
                    console.log("Found Clusters for: " + userName);
                    callback(null);
                }
            });
        }
    });
};

UserDAO.prototype.addNode = function(machine_id, source_ip, callback) {
this.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            var sql =
                squel.insert()
                    .into("nodes")
                    .set("nodes.GUID", machine_id)
                    .set("nodes.IPaddress", source_ip)
                    .toParam();

            console.log(sql);
		connection.query(sql.text, sql.values, function(err, results){
                connection.release();
                if(err){
                    console.log("Error Adding node");
                    callback(err);
                } else {
                    console.log("Added new node");
                    callback(null);
                }
	    });
	}
    });	    	
};

exports.UserDAO = UserDAO;

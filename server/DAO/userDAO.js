var mysql = require('mysql');
var squel = require('squel');
squel.useFlavour('mysql');

// creates a class which will be used to interface with the userData collection
UserDAO = function(host, port) {
    this.pool = mysql.createPool({
        host     : host,
        user     : 'root',
        password : 'admin',
        database : 'groupngo',
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

var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'admin',
	database : 'groupngo',
	port	 : 3306,
});
module.exports = connection;

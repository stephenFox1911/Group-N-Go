var express = require('express');
var path = require('path');

var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine','html');
app.engine('html', require('ejs').renderFile);
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

var login = require('./routes/login');
var createClusterGroup = require('./routes/createClusterGroup');
var createClusterJob = require('./routes/createClusterJob');
var nodeResponses = require('./routes/nodeResponses');
app.use(login);
app.use(createClusterGroup);
app.use(createClusterJob);
app.use(nodeResponses);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
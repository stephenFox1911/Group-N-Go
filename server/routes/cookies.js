var express = require('express');
var cookieParser = require('cookie-parser');


// returns a string containing the current users uname
function get_userID(){
    return req.cookies.userid;
}

module.exports = cookieParser;

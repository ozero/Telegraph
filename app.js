var express = require('express');
var mongoose = require('mongoose');


var app = express();

mongoose.connect('mongodb://localhost/app');

module.exports = app;

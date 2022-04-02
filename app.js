require('dotenv').config();

// Express
const express = require('express')

// HTTPS                                                                      
const fs = require('fs');
const https = require('https');

// Lib
const mongoose = require('mongoose')
const parser = require('body-parser')
const path = require('path')

//App
const app = express();
port = process.env.PORT || 3001;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/app')

app.use(parser.urlencoded({extended: true}))
app.use(parser.json())
app.use(express.static("public"))
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs')

require('./app/controller')(app)

// Start server
//app.listen(port, '0.0.0.0')
const options = {
  key:  fs.readFileSync('/etc/letsencrypt/live/www.xm-xm.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.xm-xm.com/cert.pem')
};
const server = https.createServer(options,app);
server.listen(port);
console.log('Server is on at https://www.xm-xm.com:' + port)



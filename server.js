/*
    Author: Volkan MUHTAR
    Date: 12/18/2018
*/

/*
    System Files  
*/
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const helper = require('./sys/helper');
const morgan = require('morgan');
const cors = require('cors');
const colors = require('colors');


/*
    Config
*/
const fs = require('fs');
const ini = require('ini');
global.conf = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

/* 
    Initiate
*/
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));
app.use(function (req, res, next) {
    helper.sessionController(req, res, next);
});

app.listen(global.conf.server.port, global.conf.server.ip, function () {
    console.log("Server Date:", new Date());
    console.log("Check URL: http://" + global.conf.server.ip + ':' + global.conf.server.port);
});

/*
    Public Controllers
*/
const auth = require('./app/public/controller/auth');
const user = require('./app/public/controller/user');


/* 
    Routes
*/

app.all('/', function (req, res, next) {
    res.send({
        service: "Indorse API",
        version: global.conf.server.version,
        date: new Date(),
        documentation: "https://docs.indorse.com"
    });
});


app.get('/user/verify/:id/:verify_code', function(req, res) {
    helper.routerRoutine('user', 'verify', res, req);
});

app.get('/auth/logout', function(req, res) {
    helper.routerRoutine('auth', 'logout', res, req);
});

app.post('/auth/login', function(req, res) {
    helper.routerRoutine('auth', 'login', res, req);
});

app.post('/user/signup', function(req, res) {
    helper.routerRoutine('user', 'signup', res, req);
});

app.all('*', function (req, res, next) {
    res.status(404).send({
        err: "Route not found."
    });
});

/* 
    Session Controller
*/

var modelAuth = require('./app/public/model/auth');
modelAuth = new modelAuth();
setInterval(function () {
    modelAuth.clearDeadSessions(global.conf.server.sessionTimeoutSeconds)
        .then(data => {
            if (data.rowCount > 0)
                console.log(data.rowCount + ' session cleared!');
        })
        .catch(err => {
            console.log(err);
        })
}, global.conf.server.sessionControlInterval * 10);


process.on('unhandledRejection', function (err) {
    console.log(err);
    helper.log('General Error', err, 'error');
});

process.on('uncaughtException', function (err) {
    console.log(err);
    helper.log('General Error', err, 'error');
});
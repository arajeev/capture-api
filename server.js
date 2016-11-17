"use strict";

var restify = require('restify');
var bunyan = require('bunyan');
var config = require('./config/default');
var sequelize = require('./config/db')(config);
var models = require('./app/models')(sequelize);
var _ = require('lodash');

// Security layer
var authenticationHelpers = require('./app/common/authentication')(config);

var userHelpers = require('./app/helpers/userHelpers')(models, authenticationHelpers);
var entryHelpers = require('./app/helpers/entryHelpers')(models, authenticationHelpers);

var userHandlers = require('./app/routes/userHandlers')(userHelpers, entryHelpers, authenticationHelpers);
var entryHandlers = require('./app/routes/entryHandlers')(userHelpers, entryHelpers);

var passport = require('passport');

// Authentication methods
var strategies = require('./app/authentication/strategies')(userHelpers, authenticationHelpers);

passport.use(strategies.BasicStrategy);
passport.use(strategies.BearerStrategy);

var restifyLogger = new bunyan({
    name: 'restify',
    streams: [
        {
            level: 'error',
            stream: process.stdout
        },
        {
            level: 'info',
            stream: process.stdout
        }
    ]
});

var server = restify.createServer({
    log: restifyLogger,
});

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization");
    return next();
  }
);

// Add audit logging
server.on('after', restify.auditLogger({
    log: restifyLogger
}));

// Log uncaught exceptions
server.on('uncaughtException', function (req, res, route, error) {
    req.log.error(error);
    res.send(500, new Error(error));
});

// Restify config
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(passport.initialize());

server.opts(/\.*/, function (req, res, next) {
    res.send(200);
    next();
});
server.pre(restify.sanitizePath());
server.use(function (req, res, next) {
    if ((req.method === "PUT" || req.method === "POST") && _.isUndefined(req.body)) {
        req.body = {};
    }
    next();
});

var needsGroup = function(group) {
    return [
       passport.authenticate('basic', {session: false}),
       function(req, res, next) {
         if (req.user && req.user.group === group)
           next();
         else
           res.send(403, 'Unauthorized');
       }
     ];
};

// Routes
// User
server.get('/user/all', needsGroup('admin'), userHandlers.allUsers); // User route: get all the users
server.get('/user/:uid', passport.authenticate(['basic', 'bearer'], {session: false}), userHandlers.userById); // User route: get user by the id
server.post('/user/', passport.authenticate(['basic', 'bearer'], {session: false}), userHandlers.login); // User route: get user by the id
server.post('/user/create/', needsGroup('admin'), userHandlers.createUser); // User route: create a user
server.del('/user/delete/:uid', passport.authenticate(['basic', 'bearer'] , {session: false}), userHandlers.deleteUser); // User route: create a user

// Entry
server.get('/journal/entries', passport.authenticate(['basic', 'bearer'], {session: false}), entryHandlers.allEntries);
server.get('/journal/entries/:eid', passport.authenticate(['basic', 'bearer'], {session: false}), entryHandlers.entryById);
server.post('/journal/create', passport.authenticate(['basic', 'bearer'], {session: false}), entryHandlers.createEntry);
server.del('/journal/delete/:eid', passport.authenticate(['basic', 'bearer'], {session: false}), entryHandlers.deleteEntry);

sequelize.authenticate().then(function () {
    console.log('Connection has been established successfully');
    // use .sync{ force: true } to drop the db and make a new db from the schema
    sequelize.sync().then(function () {
    // sequelize.sync({force: true}).then(function () {
        server.listen(config.port, function () {
            console.log(' --- Listening to %s --- ', server.url);
        });
    });
}).catch(function (err) {
    console.log('Unable to connect to db: ', err);
});

server.db = {};
server.db.sequelize = sequelize;
server.db.models = models;
module.exports = server;

"use strict";

var _ = require('lodash');
var httpErrors = require('restify').errors;
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var validateParams = require('../common/validateParams');

module.exports = function (userHelpers, entryHelpers, authenticationHelpers) {

    var allUsers = function allUsers(req, res, next) {
        userHelpers.getUsers().then(function (users) {
            res.json({"users": users});
            next();
        });
    };

    var userById = function userById(req, res, next) {
        userHelpers.getUserById(req.params.uid).then(function(user){
            // if the user is not an admin and is not accessing their own user info
            if(! _.isEqual(user.uid, parseInt(req.user.uid)) && req.user.group !== 'admin') {
                res.json(403, 'Unauthorized');
                next();
                return;
            }

            res.json({"user" : user});
            next();
        }).catch(errors.UserNotFoundError, sendError(httpErrors.NotFoundError, next));
    };

    var createUser = function createUser(req, res, next) {
        validateParams([
            {name: 'first_name', in: req.body, required: true},
            {name: 'last_name', in: req.body, required: true},
            {name: 'email', in: req.body, required: true},
            {name: 'username', in: req.body, required: true},
            {name: 'password', in: req.body, required: true},
            {name: 'group', in: req.body, required: true},
        ]).then(function () {
            var userInfo = _.pick(
                req.body,
                'first_name',
                'last_name',
                'email',
                'username',
                'password',
                'group'
            );
            userHelpers.createUser(userInfo)
                .then(function (user) {
                    res.json(201, user);
                    next();
                }).catch(errors.UserExistsError, sendError(httpErrors.ConflictError, next));
        }).catch(errors.ValidationError, sendError(httpErrors.NotFoundError, next));
    };

    var login = function login(req, res, next){
            res.json(200, req.user);
            next();
    }

    var deleteUser = function deleteUser(req, res, next) {
        userHelpers.getUserById(req.params.uid)
            .then(function (user) {
                if(! _.isEqual(user.uid, parseInt(req.user.uid)) && req.user.group !== 'admin') {
                    res.json(403, 'Unauthorized');
                    next();
                    return;
                }

                userHelpers.deleteUser(req.params.uid)
                .then(function (){
                    res.send(204, 'Deleted');
                    next();
                }).catch(errors.UserNotFoundError, sendError(httpErrors.NotFoundError, next));
            }).catch(errors.UserNotFoundError, sendError(httpErrors.NotFoundError, next));;
    };

    return {
        allUsers: allUsers,
        userById: userById,
        login: login,
        createUser: createUser,
        deleteUser: deleteUser
    };
};

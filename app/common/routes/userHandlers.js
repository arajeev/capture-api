"use strict";

var _ = require('lodash');
var httpErrors = require('restify').errors;
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var validateParams = require('../common/validateParams');

module.exports = function (userHelpers, entryHelpers, authenticationHelpers) {

    /*
    Request:
        params:
        header: admin_token
        body: {}
    Response:
        Success:
        200 - Success
        body: {
            users: [
                {
                    "id": [INTEGER],
                    "name": [STRING],
                    "email": [STRING],
                    "updatedAt": [STRING],
                    "createdAt": [STRING]
                },
            ]
        }
        Failure:
    */
    var allUsers = function allUsers(req, res, next) {
        userHelpers.getUsers().then(function (users) {
            res.json({"users": users});
            next();
        });
    };

    /*
    Request:
        params: id of target user
        header: admin_token
        body: {}
    Response:
        Success:
        200 - Success
        body: {
            "id": [INTEGER],
            "name": [STRING],
            "email": [STRING],
            "updatedAt": [STRING],
            "createdAt": [STRING]
        }
        Failure:
        404 - NotFoundError
    */
    var userById = function userById(req, res, next) {
        // req.user would have had a value but authentication is turned off. Thus that cb is not
        // hit.
        // TODO: Validate params
        userHelpers.getUserById(req.params.uid).then(function(user){
            res.json({"user" : user});
            next();
        });
    };

    /*
    Request:
        params:
        header: admin_token
        body: {
            "first_name": [STRING],
            "last_name": [STRING],
            "email": [STRING],
            "username": [STRING],
            "password": [STRING],
        }
    Response:
        Success:
        201 - Success
        body: {
            "id": [INTEGER],
            "first_name": [STRING],
            "last_name": [STRING],
            "email": [STRING],
            "username": [STRING],
            "updatedAt": [STRING],
            "createdAt": [STRING]
        }
        Failure:
        409 - ConflictError
    */
    var createUser = function createUser(req, res, next) {
        validateParams([
            {name: 'first_name', in: req.body, required: false},
            {name: 'last_name', in: req.body, required: false},
            {name: 'email', in: req.body, required: false},
            {name: 'username', in: req.body, required: false},
            {name: 'password', in: req.body, required: false},
        ]).then(function () {
            var userInfo = _.pick(
                req.body,
                'first_name',
                'last_name',
                'email',
                'username',
                'password'
            );
            console.log("USER INFO ------------------", userInfo);
            userHelpers.createUser(userInfo)
                .then(function (user) {
                    entryHelpers.createEntry(user, {
                        "name": "Sample Entry",
                        "text": "Default text",
                        "date": "date",
                        "media": "-",
                        "location": "-",
                        "time": "12:00"
                    }).then(function(entry){
                        user.addEntry(entry);
                        res.json(201, user);
                        next();
                    });
                }).catch(errors.UserExistsError, sendError(httpErrors.ConflictError, next));
        }).catch(errors.ValidationError, sendError(httpErrors.NotFoundError, next));
    };

    /*
    Request:
        params: id of user to be deleted
        header: admin_token
        body: {}
    Response:
        Success:
        204 - No content
        Failure:
        401 - UnauthorizedError
        403 - ForbiddenError
        body: {}
    */

    var login = function login(req, res, next){
        // console.log(req.body);
        // validateParams([
        //     {name: 'username', in: req.body, required: true},
        //     {name: 'password', in: req.body, required: true},
        // ]).
        // then(function () {
            res.json(200, req.user);
            next();
        // }).catch(errors.ValidationError, sendError(httpErrors.NotFoundError, next));
    };

    /*
    Request:
        params: id of user to be deleted
        header: admin_token
        body: {}
    Response:
        Success:
        204 - No content
        Failure:
        401 - UnauthorizedError
        403 - ForbiddenError
        body: {}
    */
    var deleteUser = function deleteUser(req, res, next) {
        userHelpers.deleteUser(req.params.uid)
            .then(function () {
                res.send(204);
                next();
            });
    };

    return {
        allUsers: allUsers,
        userById: userById,
        login: login,
        createUser: createUser,
        deleteUser: deleteUser
    };
};

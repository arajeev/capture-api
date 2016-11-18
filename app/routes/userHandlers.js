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
            // if the user is not an admin and is not accessing their own user info
            console.log(req.user.group, "------------", parseInt(req.user.uid));
            if(! _.isEqual(user.uid, parseInt(req.user.uid)) && req.user.group !== 'admin') {
                res.json(403, 'Unauthorized');
                next();
                return;
            }

            res.json({"user" : user});
            next();
        }).catch(errors.UserNotFoundError, sendError(httpErrors.NotFoundError, next));
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
            console.log("USER INFO ------------------", userInfo);
            userHelpers.createUser(userInfo)
                .then(function (user) {
                    res.json(201, user);
                    next();
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
            res.json(200, req.user);
            next();
    }

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
                });
            }).v;
    };

    return {
        allUsers: allUsers,
        userById: userById,
        login: login,
        createUser: createUser,
        deleteUser: deleteUser
    };
};

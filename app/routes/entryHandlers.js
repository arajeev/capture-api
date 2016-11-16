"use strict";

var _ = require('lodash');
var httpErrors = require('restify').errors;
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var validateParams = require('../common/validateParams');

module.exports = function (entryHelpers) {

    var allEntries = function allEntries(req, res, next) {
        entryHelpers.getEntries(req.user)
            .then(function(entries){
                res.json(200, {
                    "entries": entries
                });
                next();
            });
    };

    var entryById = function entryById(req, res, next) {
        entryHelpers.getEntryById(req.user, req.params.eid)
            .then(function(entries){
                if (entries.length == 0){
                    throw new errors.EntryNotFoundError(req.params.eid);
                } else {
                    res.json(200, {"entry": entries[0]});
                    next();
                }
            }).catch(errors.EntryNotFoundError, sendError(httpErrors.NotFoundError, next));
    };

    var createEntry = function createEntry(req, res, next) {
        validateParams([
            {name: 'heading', in: req.body, required: true},
            {name: 'media', in: req.body, required: true},
            {name: 'location', in: req.body, required: true},
            {name: 'text', in: req.body, required: true},
        ]).then(function () {
            var entryInfo = _.pick(
                req.body,
                'heading',
                'media',
                'location',
                'text'
            );
            entryHelpers.createEntry(req.user, entryInfo)
                .then(function(entry){
                    res.json(201, entry);
                    next();
                }).catch(errors.DuplicateEntryError, sendError(httpErrors.ConflictError, next));
        });
    };

    var deleteEntry = function deleteEntry(req, res, next) {
        req.user.getEntries({where: {eid: req.params.eid}})
            .then(function(entries){
                if (entries.length == 0){
                    throw new errors.EntryNotFoundError(req.params.eid);
                } else {
                    entries[0].destroy()
                        .then(function(){
                            res.json(204);
                            next();
                        });
                }
            }).catch(errors.EntryNotFoundError, sendError(httpErrors.NotFoundError, next));
    };

    return {
        allEntries: allEntries,
        entryById: entryById,
        createEntry: createEntry,
        deleteEntry: deleteEntry
    };
};

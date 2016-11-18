"use strict";

var _ = require('lodash');
var errors = require('../common/errors');
var Promise = require('bluebird');

module.exports = function (models, authenticationHelpers) {

    // Returns lists for the given user
    var getEntries = function getEntries(user) {
        return user.getEntries(function(entries){
            return entries;
        }).then(function(entries) {
            return entries;
        });
    };

    // Gets a list by the id
    var getEntryById = function getEntryById(user, entryId){
        return user.getEntries({
            where: {
                eid: entryId
            }
        }).then(function(entries) {
            return entries[0];
        });
    };

    // Expects a Entry where the eid is not already existing:
    // {
    //     {
    //     "eid": [INTEGER],
    //     "heading": [STRING],
    //     "uid": [INTEGER],
    //     "media": [STRING],
    //     "loc_latitude": [FLOAT],
    //     "loc_longitude": [FLOAT],
    //     "updatedAt": [STRING],
    //     "createdAt": [STRING],
    //     "text": [STRING]
    //     }
    // }
    
    var createEntry = function createEntry(user, entryInfo){
        return models.Entry.create({
            heading: entryInfo.heading,
            text: entryInfo.text,
            media: entryInfo.media,
            loc_latitude: entryInfo.loc_latitude,
            loc_longitude: entryInfo.loc_longitude
        }).then(function(entry){
            user.addEntry(entry);
            return entry;
        });
    };

    var deleteEntry = function deleteEntry(req, res, next) {
       userHelpers.deleteUser(req.params.id)
           .then(function () {
               res.send(204);
               next();
           });
   };

    return {
        getEntries: getEntries,
        getEntryById: getEntryById,
        createEntry: createEntry,
        deleteEntry: deleteEntry
    };
};

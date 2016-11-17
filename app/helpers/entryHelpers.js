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
    //     "date": [STRING],
    //     "time": [STRING],
    //     "uid": [INTEGER],
    //     "media": [STRING],
    //     "location": [STRING],
    //     "updatedAt": [STRING],
    //     "createdAt": [STRING],
    //     "text": [STRING]
    //     }
    // }
    var createEntry = function createEntry(user, entryInfo){
        return models.Entry.create({
            heading: entryInfo.heading,
            text: entryInfo.text,
            date: entryInfo.date,
            time: entryInfo.time,
            media: entryInfo.media,
            location: entryInfo.location
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

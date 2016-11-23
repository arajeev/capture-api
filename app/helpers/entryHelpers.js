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

    // Creates an entry for the given user, using given entryInfo
    var createEntry = function createEntry(user, entryInfo){
        return models.Entry.create({
            heading: entryInfo.heading,
            text: entryInfo.text,
            media: entryInfo.media,
            loc_latitude: entryInfo.loc_latitude,
            loc_longitude: entryInfo.loc_longitude,
            address: entryInfo.address
        }).then(function(entry){
            user.addEntry(entry);
            return entry;
        });
    };

    // deletes entry with the given entryId
    var deleteEntry = function deleteEntry(entryId) {
        return models.Entry.find({where: {eid: entryId}})
        .then(function (entry) {
            if (!_.isNull(entry)) {
                return entry.destroy();
            }
        });
    };

    // edits the given entry and updates it with the given filters
    var editEntry = function editEntry(user, filters, entryId) {
        return getEntryById(user, entryId)
        .then(function(entry) {
            if (entry != null) {
                for (var key in filters) {
                    if (filters.hasOwnProperty(key)) {
                        entry.set(key, filters[key]);
                    }
                };
                entry.save().then(function(entry) {});
            }
            return entry;
        });
    };

    return {
        getEntries: getEntries,
        getEntryById: getEntryById,
        createEntry: createEntry,
        deleteEntry: deleteEntry,
        editEntry: editEntry
    };
};

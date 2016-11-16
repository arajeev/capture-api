"use strict";

var util = require("util");
var _ = require("lodash");

function UserExists(username) {
    this.message = "Username exists: " + username;
}
util.inherits(UserExists, Error);

function UserNotFound(username) {
    this.message = "Username does not exist: " + username;
}
util.inherits(UserNotFound, Error);

function DuplicateEntry(entryname) {
    this.message = "Entry name exists: " + entryname;
}
util.inherits(DuplicateEntry, Error);

function EntryNotFound(entryId) {
    this.message = "Entry id not found: " + entryId;
}
util.inherits(EntryNotFound, Error);

function Validation(errs) {
    this.message = _.pluck(errs, "message").join("; ");
}
util.inherits(Validation, Error);

function MissingArgument(argName) {
    this.message = "Missing argument: " + argName;
}
util.inherits(MissingArgument, Error);

module.exports = {
    UserExistsError: UserExists,
    UserNotFoundError: UserNotFound,
    DuplicateEntryError: DuplicateEntry,
    EntryNotFoundError: EntryNotFound,
    ValidationError: Validation,
    MissingArgumentError: MissingArgument,
};

"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('entry', {
        eid: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        heading: {type: DataTypes.STRING},
        media: {type: DataTypes.STRING},
        location: {type: DataTypes.STRING},
        text: {type: DataTypes.STRING}
    }, {
        timestamps: true,
        classMethods: {
            associate: function (sequelize, models) {
                models.Entry.belongsTo(models.User);
            }
        },
        indexes: [
            {fields: ['eid'], method: 'BTREE'},
        ]
    });
};

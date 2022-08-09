/**
 * Purpose: provide specifications on the course schema (title, description, estimatedTime, materialsNeeded,userID)
 */

 'use strict';

const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");

//Course Model that is 1-1 association with user model

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init(
    {
      title: {
        type: DataTypes.STRING, //datatype
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter a title",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter a description",
          },
        },
      },
      estimatedTime: {
        type: DataTypes.STRING,
      },
      materialsNeeded: {
        type: DataTypes.STRING,
      },
    },
    { sequelize }
  );

 //1-1 association - created in the model associations with the foreignKey property
  Course.associate = (models) => {
    Course.belongsTo(models.User, { ////A BelongsTo association is defined between the Course and User models
      as: "Student",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return Course;
};
/**
 * set datatypes for the user model
 */


const bcrypt = require("bcryptjs/dist/bcrypt");
const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");

//User Model

module.exports = (sequelize) => {
  class User extends Model {}
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter your first name",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter your last name",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "The email you entered already exists in our database",
        },
        validate: {
          notNull: {
            msg: "An email is required",
          },
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "An password is required",
          },
        },
        set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue("password", hashedPassword);
        },
      },
    },
    { sequelize }
  );


  User.associate = (models) => {
    User.hasMany(models.Course, { //A HasMany association is defined between the User and Course models
      as: "Student",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return User;
};
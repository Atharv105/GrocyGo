const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mobile: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
        len: [10, 10]
    }
},

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("CUSTOMER", "ADMIN"),
      defaultValue: "CUSTOMER",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
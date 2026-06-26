const sequelize = require("../config/database");

const db = {};

db.sequelize = sequelize;

// Import Models
db.User = require("./User");

module.exports = db;
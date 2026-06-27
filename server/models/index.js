const sequelize = require("../config/database");

const db = {};

db.sequelize = sequelize;

// Import Models
db.User = require("./User");
db.Category = require("./Category");

module.exports = db;
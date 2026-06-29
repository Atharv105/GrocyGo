const sequelize = require("../config/database");

const db = {};

db.sequelize = sequelize;

// Import Models
db.User = require("./User");
db.Category = require("./Category");
db.Product = require("./Product");

// Relationships
db.Category.hasMany(db.Product,{
    foreignKey: "categoryId",
    onDelete: "RESTRICT",
});

db.Product.belongsTo(db.Category,{
    foreignKey: "categoryId",
});
module.exports = db;
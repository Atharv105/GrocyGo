const sequelize = require("../config/database");

const db = {};

db.sequelize = sequelize;

// Import Models
db.User = require("./User");
db.Category = require("./Category");
db.Product = require("./Product");
db.Cart = require("./Cart");
db.CartItem = require("./CartItem");

// Relationships
db.Category.hasMany(db.Product,{
    foreignKey: "categoryId",
    onDelete: "RESTRICT",
});

db.Product.belongsTo(db.Category,{
    foreignKey: "categoryId",
});


//User <-> Cart
db.User.hasOne(db.Cart,{
    foreignKey : "userId",
    onDelete : "CASCADE",
});

db.Cart.belongsTo(db.User,{
    foreignKey : "userId",
});

//Cart <-> CartItem
db.Cart.hasMany(db.CartItem,{
    foreignKey : "cartId",
    onDelete : "CASCADE",
});

db.CartItem.belongsTo(db.Cart,{
    foreignKey : "cartId",
});

//Product <-> CartItem
db.Product.hasMany(db.CartItem,{
    foreignKey : "productId",
});

db.CartItem.belongsTo(db.Product,{
    foreignKey : "productId",
});

module.exports = db;
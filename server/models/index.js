const sequelize = require("../config/database");

const db = {};

db.sequelize = sequelize;

// Import Models
db.User = require("./User");
db.Category = require("./Category");
db.Product = require("./Product");
db.Cart = require("./Cart");
db.CartItem = require("./CartItem");
db.Order = require("./Order");
db.OrderItem = require("./OrderItem");

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


//User ↔ Order

db.User.hasMany(db.Order, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

db.Order.belongsTo(db.User, {
  foreignKey: "userId",
});

// Order ↔ OrderItem

db.Order.hasMany(db.OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

db.OrderItem.belongsTo(db.Order, {
  foreignKey: "orderId",
});

// Product ↔ OrderItem

db.Product.hasMany(db.OrderItem, {
  foreignKey: "productId",
});

db.OrderItem.belongsTo(db.Product, {
  foreignKey: "productId",
});



module.exports = db;
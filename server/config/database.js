const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      charset: "utf8mb4"
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci"
    },
    pool: {
      max: 50, // maximum number of connections in pool
      min: 5,  // minimum number of connections in pool
      acquire: 30000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000 // maximum time, in milliseconds, that a connection can be idle before being released
    }
  }
);

module.exports = sequelize;
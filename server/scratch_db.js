const sequelize = require("./config/database");

async function run() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    // Add purchasePrice to products
    await sequelize.query(
      "ALTER TABLE products ADD COLUMN purchasePrice DECIMAL(10,2) NOT NULL DEFAULT 0.00;"
    );
    console.log("Added purchasePrice to products.");

    // Add tracking columns to order_items
    await sequelize.query(
      "ALTER TABLE order_items ADD COLUMN purchasePriceAtOrder DECIMAL(10,2) NOT NULL DEFAULT 0.00;"
    );
    await sequelize.query(
      "ALTER TABLE order_items ADD COLUMN sellingPriceAtOrder DECIMAL(10,2) NOT NULL DEFAULT 0.00;"
    );
    await sequelize.query(
      "ALTER TABLE order_items ADD COLUMN discountAtOrder DECIMAL(10,2) NOT NULL DEFAULT 0.00;"
    );
    await sequelize.query(
      "ALTER TABLE order_items ADD COLUMN finalSellingPriceAtOrder DECIMAL(10,2) NOT NULL DEFAULT 0.00;"
    );
    
    // Default the historical metrics using the existing 'price' column as the base
    await sequelize.query(
      "UPDATE order_items SET finalSellingPriceAtOrder = price, sellingPriceAtOrder = price;"
    );
    console.log("Added and initialized tracking columns to order_items.");

  } catch (error) {
    console.error("Error running migration:", error);
  } finally {
    process.exit(0);
  }
}

run();

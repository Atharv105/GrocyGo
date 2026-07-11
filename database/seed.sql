-- ============================================================
-- GrocyGo — Seed Data
-- Database: grocery_store
-- Skips: users (already have 2 customers + 1 admin)
-- Includes: categories + products
-- ============================================================

USE grocery_store;

-- Force the connection character set to utf8mb4 to support emojis
SET NAMES utf8mb4;

-- Safely drop existing tables (disabling foreign keys temporarily to avoid constraint issues)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
SET FOREIGN_KEY_CHECKS = 1;

-- Create categories table with utf8mb4 support
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `image` VARCHAR(255) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create products table with utf8mb4 support
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `unit` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `categoryId` INT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  CONSTRAINT `fk_products_categories` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ============================================================
-- STEP 1: CATEGORIES  (run this first)
-- ============================================================

INSERT INTO `categories` (`name`, `description`, `image`, `createdAt`, `updatedAt`) VALUES
('Fruits & Vegetables',  'Fresh daily fruits and vegetables',              '🥦', NOW(), NOW()),
('Dairy & Eggs',         'Milk, cheese, butter, curd, and eggs',           '🥛', NOW(), NOW()),
('Grains & Cereals',     'Rice, wheat, oats, pulses and lentils',          '🌾', NOW(), NOW()),
('Snacks & Beverages',   'Chips, biscuits, juices, tea and coffee',        '🍿', NOW(), NOW()),
('Meat & Fish',          'Fresh chicken, mutton, fish and seafood',        '🐟', NOW(), NOW()),
('Bakery & Bread',       'Fresh breads, cakes, buns and pastries',         '🍞', NOW(), NOW()),
('Spices & Condiments',  'Masalas, sauces, pickles and oils',              '🌶️', NOW(), NOW()),
('Frozen Foods',         'Frozen vegetables, ice cream and ready meals',   '🧊', NOW(), NOW());

-- Verify: SELECT id, name FROM categories;


-- ============================================================
-- STEP 2: PRODUCTS
-- Assumes category IDs are 1-8 in the order inserted above.
-- If your IDs differ, adjust the categoryId values below.
-- ============================================================

-- ----- Fruits & Vegetables (categoryId = 1) -----
INSERT INTO `products` (`name`, `description`, `price`, `stock`, `unit`, `image`, `isActive`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('Tomatoes',       'Fresh red farm tomatoes',                    25.00,  80,  '500g',  '🍅', 1, 1, NOW(), NOW()),
('Onions',         'Premium quality white onions',               30.00, 120,  '1kg',   '🧅', 1, 1, NOW(), NOW()),
('Potatoes',       'Farm-fresh potatoes',                        28.00, 100,  '1kg',   '🥔', 1, 1, NOW(), NOW()),
('Spinach',        'Tender green spinach leaves',                15.00,  60,  '250g',  '🥬', 1, 1, NOW(), NOW()),
('Bananas',        'Ripe yellow bananas, pack of 6',             40.00,  90,  'Pack',  '🍌', 1, 1, NOW(), NOW()),
('Apples',         'Fresh red Shimla apples',                    99.00,  50,  '4 pcs', '🍎', 1, 1, NOW(), NOW()),
('Carrots',        'Crunchy fresh orange carrots',               35.00,  70,  '500g',  '🥕', 1, 1, NOW(), NOW()),
('Cucumber',       'Cool and crisp cucumbers',                   20.00,  55,  '2 pcs', '🥒', 1, 1, NOW(), NOW());

-- ----- Dairy & Eggs (categoryId = 2) -----
INSERT INTO `products` (`name`, `description`, `price`, `stock`, `unit`, `image`, `isActive`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('Full Cream Milk',  'Fresh pasteurised full cream milk',         60.00, 100,  '1L',    '🥛', 1, 2, NOW(), NOW()),
('Amul Butter',      'Salted butter from Amul',                   55.00,  80,  '100g',  '🧈', 1, 2, NOW(), NOW()),
('Paneer',           'Fresh soft cottage cheese',                 90.00,  45,  '200g',  '🧀', 1, 2, NOW(), NOW()),
('Curd / Dahi',      'Thick set creamy curd',                     45.00,  60,  '400g',  '🥣', 1, 2, NOW(), NOW()),
('Eggs',             'Farm-fresh eggs, tray of 12',               80.00,  70,  'Tray',  '🥚', 1, 2, NOW(), NOW()),
('Cheese Slices',    'Processed cheese slices, pack of 10',       99.00,  40,  'Pack',  '🧀', 1, 2, NOW(), NOW());

-- ----- Grains & Cereals (categoryId = 3) -----
INSERT INTO `products` (`name`, `description`, `price`, `stock`, `unit`, `image`, `isActive`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('Basmati Rice',        'Long grain premium basmati rice',       120.00,  60,  '1kg',   '🌾', 1, 3, NOW(), NOW()),
('Wheat Flour (Atta)',  'Whole wheat chakki fresh atta',           65.00,  80,  '1kg',   '🌾', 1, 3, NOW(), NOW()),
('Toor Dal',            'Yellow pigeon peas dal',                 90.00,  50,  '500g',  '🫘', 1, 3, NOW(), NOW()),
('Chana Dal',           'Split chickpea lentils',                 85.00,  50,  '500g',  '🫘', 1, 3, NOW(), NOW()),
('Rolled Oats',         'Quick cook breakfast oats',              75.00,  40,  '500g',  '🥣', 1, 3, NOW(), NOW()),
('Poha',                'Flattened rice flakes for breakfast',    45.00,  55,  '500g',  '🍚', 1, 3, NOW(), NOW());

-- ----- Snacks & Beverages (categoryId = 4) -----
INSERT INTO `products` (`name`, `description`, `price`, `stock`, `unit`, `image`, `isActive`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('Lays Classic',        'Classic salted potato chips',            20.00, 100,  '73g',   '🍟', 1, 4, NOW(), NOW()),
('Bournvita',           'Chocolate malt health drink powder',    199.00,  30,  '500g',  '☕', 1, 4, NOW(), NOW()),
('Tata Tea Gold',       'Premium blend black tea leaves',        130.00,  50,  '250g',  '🍵', 1, 4, NOW(), NOW()),
('Tropicana Orange',    'Fresh orange juice, no added sugar',     80.00,  60,  '1L',    '🍊', 1, 4, NOW(), NOW()),
('Good Day Biscuits',   'Butter cookies pack',                    30.00,  90,  '250g',  '🍪', 1, 4, NOW(), NOW()),
('Sprite',              'Chilled lime soda carbonated drink',     40.00,  80,  '750ml', '🥤', 1, 4, NOW(), NOW());

-- ----- Meat & Fish (categoryId = 5) -----
INSERT INTO `products` (`name`, `description`, `price`, `stock`, `unit`, `image`, `isActive`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('Chicken Breast',  'Fresh boneless skinless chicken breast',    220.00,  30,  '500g',  '🍗', 1, 5, NOW(), NOW()),
('Rohu Fish',       'Fresh Rohu fish, cleaned and cut',          180.00,  20,  '500g',  '🐟', 1, 5, NOW(), NOW()),
('Prawns',          'Fresh medium-sized prawns, deveined',       250.00,  15,  '250g',  '🦐', 1, 5, NOW(), NOW()),
('Mutton (Goat)',   'Fresh tender goat mutton pieces',           380.00,  10,  '500g',  '🥩', 1, 5, NOW(), NOW()),
('Salmon Fillet',   'Fresh Atlantic salmon fillet',              350.00,   8,  '250g',  '🐠', 1, 5, NOW(), NOW());

-- ----- Bakery & Bread (categoryId = 6) -----
INSERT INTO `products` (`name`, `description`, `price`, `stock`, `unit`, `image`, `isActive`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('Whole Wheat Bread',  'Soft whole wheat sandwich bread loaf',    45.00,  40,  '400g',  '🍞', 1, 6, NOW(), NOW()),
('Croissants',         'Buttery flaky croissants, pack of 4',     80.00,  25,  'Pack',  '🥐', 1, 6, NOW(), NOW()),
('Burger Buns',        'Soft sesame burger buns, pack of 6',      55.00,  30,  'Pack',  '🍔', 1, 6, NOW(), NOW()),
('Pav (Dinner Rolls)', 'Soft ladi pav rolls, pack of 12',         35.00,  50,  'Pack',  '🍞', 1, 6, NOW(), NOW()),
('Chocolate Cake',     'Moist chocolate sponge cake slice',       70.00,  20,  '1 pc',  '🍰', 1, 6, NOW(), NOW());

-- ----- Spices & Condiments (categoryId = 7) -----
INSERT INTO `products` (`name`, `description`, `price`, `stock`, `unit`, `image`, `isActive`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('Turmeric Powder',   'Pure haldi powder for cooking',            55.00,  60,  '100g',  '🌿', 1, 7, NOW(), NOW()),
('Red Chilli Powder', 'Spicy Kashmiri lal mirch powder',          65.00,  55,  '100g',  '🌶️', 1, 7, NOW(), NOW()),
('Garam Masala',      'Aromatic whole spice blend powder',        75.00,  45,  '50g',   '🫙', 1, 7, NOW(), NOW()),
('Tomato Ketchup',    'Heinz classic tomato ketchup',             95.00,  40,  '500g',  '🍅', 1, 7, NOW(), NOW()),
('Mustard Oil',       'Cold-pressed pure mustard cooking oil',   120.00,  35,  '1L',    '🫙', 1, 7, NOW(), NOW()),
('Coconut Oil',       'Pure organic virgin coconut oil',         150.00,   4,  '500ml', '🥥', 1, 7, NOW(), NOW());
-- Note: Coconut Oil stock = 4 (will appear as "Low Stock" in the admin panel)

-- ----- Frozen Foods (categoryId = 8) -----
INSERT INTO `products` (`name`, `description`, `price`, `stock`, `unit`, `image`, `isActive`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('Frozen Peas',       'Sweet green peas, quick frozen',          65.00,  40,  '500g',  '🧊', 1, 8, NOW(), NOW()),
('Ice Cream Vanilla', 'Creamy vanilla ice cream tub',           120.00,  25,  '500ml', '🍨', 1, 8, NOW(), NOW()),
('Frozen Corn',       'Golden sweet corn kernels, frozen',       70.00,  35,  '500g',  '🌽', 1, 8, NOW(), NOW()),
('Frozen Paratha',    'Ready-to-cook wheat parathas, pack of 5', 90.00,  30,  'Pack',  '🫓', 1, 8, NOW(), NOW()),
('Chicken Nuggets',   'Crispy breaded chicken nuggets, 15 pcs', 180.00,   3,  'Pack',  '🍗', 1, 8, NOW(), NOW());
-- Note: Chicken Nuggets stock = 3 (will appear as "Low Stock" in the admin panel)

-- ============================================================
-- Verification Queries
-- ============================================================

-- SELECT id, name FROM categories ORDER BY id;
-- SELECT id, name, price, stock, unit, categoryId FROM products ORDER BY categoryId, id;
-- SELECT COUNT(*) AS total_products FROM products;
-- SELECT c.name AS category, COUNT(p.id) AS product_count FROM categories c LEFT JOIN products p ON p.categoryId = c.id GROUP BY c.id, c.name;


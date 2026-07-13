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
('Fruits & Vegetables',  'Fresh daily fruits and vegetables',              'https://res.cloudinary.com/n0he2dk8/image/upload/v1783860009/Fruits_and_vegetables_iy4uw6.png', NOW(), NOW()),
('Dairy & Eggs',         'Milk, cheese, butter, curd, and eggs',           'https://res.cloudinary.com/n0he2dk8/image/upload/v1783869620/Dairy_and_eggs_johjhr.png', NOW(), NOW()),
('Grains & Cereals',     'Rice, wheat, oats, pulses and lentils',          'https://res.cloudinary.com/n0he2dk8/image/upload/v1783859962/grains_and_cereals_ci6pob.png', NOW(), NOW()),
('Snacks & Beverages',   'Chips, biscuits, juices, tea and coffee',        'https://res.cloudinary.com/n0he2dk8/image/upload/v1783859903/Snacks_and_beverages_p7tsla.png', NOW(), NOW()),
('Meat & Fish',          'Fresh chicken, mutton, fish and seafood',        'https://res.cloudinary.com/n0he2dk8/image/upload/v1783859934/Fresh_meats_zmadqd.png', NOW(), NOW()),
('Bakery & Bread',       'Fresh breads, cakes, buns and pastries',         'https://res.cloudinary.com/n0he2dk8/image/upload/v1783860081/baked_bakery_anf1c7.png', NOW(), NOW()),
('Spices & Condiments',  'Masalas, sauces, pickles and oils',              'https://res.cloudinary.com/n0he2dk8/image/upload/v1783859851/Spice_b41rcj.png', NOW(), NOW()),
('Frozen Foods',         'Frozen vegetables, ice cream and ready meals',   'https://res.cloudinary.com/n0he2dk8/image/upload/v1783860039/frozen_foods_rjymar.png', NOW(), NOW());

-- Verify: SELECT id, name FROM categories;


-- ============================================================
-- STEP 2: PRODUCTS
-- Assumes category IDs are 1-8 in the order inserted above.
-- If your IDs differ, adjust the categoryId values below.
-- ============================================================

INSERT INTO products (id,name,description,price,stock,unit,image,isActive,categoryId)
VALUES
(1,'Tomatoes','Fresh red farm tomatoes',25.00,80,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861176/Fresh_tomatoes_gzxrkk.png',1,1),
(2,'Onions','Premium quality white onions',30.00,120,'1kg','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860946/Onions_newzui.png',1,1),
(3,'Potatoes','Farm-fresh potatoes',28.00,100,'1kg','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860996/Potatoes_sekdcl.png',1,1),
(4,'Spinach','Tender green spinach leaves',15.00,60,'250g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861049/Fresh_spinach_qt5kbd.png',1,1),
(5,'Bananas','Ripe yellow bananas, pack of 6',40.00,90,'Pack','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860205/Ripe_bananas_hgooij.png',1,1),
(6,'Apples','Fresh red Shimla apples',99.00,50,'4 pcs','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860187/Red_apples_tvfshj.png',1,1),
(7,'Carrots','Crunchy fresh orange carrots',35.00,70,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860280/carrots_jxv42f.png',1,1),
(8,'Cucumber','Cool and crisp cucumbers',20.00,55,'2 pcs','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860395/cucumbers_sblp1x.png',1,1),
(9,'Full Cream Milk','Fresh pasteurised full cream milk',60.00,100,'1L','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860886/Milk_hgdsws.png',1,2),
(10,'Amul Butter','Salted butter from Amul',55.00,80,'100g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860172/Amul_butter_pfsuzo.png',1,2),
(11,'Paneer','Fresh soft cottage cheese',90.00,45,'200g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860958/Fresh_paneer_gdeny4.png',1,2),
(12,'Curd / Dahi','Thick set creamy curd',45.00,60,'400g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860851/Fresh_curd_mmbt2v.png',1,2),
(13,'Eggs','Farm-fresh eggs, tray of 12',80.00,70,'Tray','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860859/fresh_eggs_fh3y3a.png',1,2),
(14,'Cheese Slices','Processed cheese slices, pack of 10',99.00,40,'Pack','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860239/Amul_cheese_slices_sryfne.png',1,2),
(15,'Basmati Rice','Long grain premium basmati rice',120.00,60,'1kg','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860218/Basmati_rice_2_vsij4y.png',1,3),
(16,'Wheat Flour (Atta)','Whole wheat chakki fresh atta',65.00,80,'1kg','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861212/wheat_flour_2_oyovox.png',1,3),
(17,'Toor Dal','Yellow pigeon peas dal',90.00,50,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861188/toor_dal_2_q0htqo.png',1,3),
(18,'Chana Dal','Split chickpea lentils',85.00,50,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860230/chana_dal_mlgxm7.png',1,3),
(19,'Rolled Oats','Quick cook breakfast oats',75.00,40,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861029/Rolled_oats_gitecf.png',1,3),
(20,'Poha','Flattened rice flakes for breakfast',45.00,55,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860987/Poha_qx2cs9.png',1,3),
(21,'Lays Classic','Classic salted potato chips',20.00,100,'73g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860920/Lay_s_Classic_chips_hpad2i.png',1,4),
(22,'Bournvita','Chocolate malt health drink powder',199.00,30,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860271/Bournvita_tka2qw.png',1,4),
(23,'Tata Tea Gold','Premium blend black tea leaves',130.00,50,'250g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861239/whole_wheat_bread_sdos3n.png',1,4),
(24,'Tropicana Orange','Fresh orange juice, no added sugar',80.00,60,'1L','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860791/orange_juice_m1bwcq.png',1,4),
(25,'Good Day Biscuits','Butter cookies pack',30.00,90,'250g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860902/Good_Day_iruya8.png',1,4),
(26,'Sprite','Chilled lime soda carbonated drink',40.00,80,'750ml','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861133/Tata_Tea_Gold_rnskfj.png',1,4),
(27,'Chicken Breast','Fresh boneless skinless chicken breast',220.00,30,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860348/lean_chicken_xg8rqy.png',1,5),
(28,'Rohu Fish','Fresh Rohu fish, cleaned and cut',180.00,20,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860658/rohu_fish_boprsd.png',1,5),
(29,'Prawns','Fresh medium-sized prawns, deveined',250.00,15,'250g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861006/Fresh_prawns_gbqxha.png',1,5),
(30,'Mutton (Goat)','Fresh tender goat mutton pieces',380.00,10,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860938/nutritious_mutton_s7jc6c.png',1,5),
(31,'Salmon Fillet','Fresh Atlantic salmon fillet',350.00,8,'250g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861039/premium_salmon_fillet_me63cl.png',1,5),
(32,'Whole Wheat Bread','Soft whole wheat sandwich bread loaf',45.00,40,'400g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861239/whole_wheat_bread_sdos3n.png',1,6),
(33,'Croissants','Buttery flaky croissants, pack of 4',80.00,25,'Pack','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860843/warm_croissants_pr0qfw.png',1,6),
(34,'Burger Buns','Soft sesame burger buns, pack of 6',55.00,30,'Pack','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860197/soft_burger_buns_sbmojz.png',1,6),
(35,'Pav (Dinner Rolls)','Soft ladi pav rolls, pack of 12',35.00,50,'Pack','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860976/baked_soft_pav_rolls_rnstk5.png',1,6),
(36,'Chocolate Cake','Moist chocolate sponge cake slice',70.00,20,'1 pc','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860364/chocolate_cake_wjka1m.png',1,6),
(37,'Turmeric Powder','Pure haldi powder for cooking',55.00,60,'100g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861198/Turmeric_powder_amzsyl.png',1,7),
(38,'Red Chilli Powder','Spicy Kashmiri lal mirch powder',65.00,55,'100g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861020/Red_chili_powder_eexayv.png',1,7),
(39,'Garam Masala','Aromatic whole spice blend powder',75.00,45,'50g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860894/Garam_masala_l6i00h.png',1,7),
(40,'Tomato Ketchup','Heinz classic tomato ketchup',95.00,40,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783861156/tomato_ketchup_j59s7a.png',1,7),
(41,'Mustard Oil','Cold-pressed pure mustard cooking oil',120.00,35,'1L','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860928/mustard_oil_h0wo09.png',1,7),
(42,'Coconut Oil','Pure organic virgin coconut oil',150.00,4,'500ml','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860753/coconut_oil_td8kwv.png',1,7),
(43,'Frozen Peas','Sweet green peas, quick frozen',65.00,40,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860877/frozen_peas_hruvln.png',1,8),
(44,'Ice Cream Vanilla','Creamy vanilla ice cream tub',120.00,25,'500ml','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860911/vanilla_ice_cream_b7bl6e.png',1,8),
(45,'Frozen Corn','Golden sweet corn kernels, frozen',70.00,35,'500g','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860868/frozen_corn_jocrzx.png',1,8),
(46,'Frozen Paratha','Ready-to-cook wheat parathas, pack of 5',90.00,30,'Pack','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860579/Freshly_frozen_vtq8rm.png',1,8),
(47,'Chicken Nuggets','Crispy breaded chicken nuggets, 15 pcs',180.00,3,'Pack','https://res.cloudinary.com/n0he2dk8/image/upload/v1783860609/Chicken_Nuggets_sqbur2.png',1,8),
(48,'Hapus Mango','Fresh and sweet',300.00,5,'12 pcs','https://res.cloudinary.com/n0he2dk8/image/upload/v1783875244/Hapus_mango_tcwsas.jpg',1,1);

-- Note: Chicken Nuggets stock = 3 (will appear as "Low Stock" in the admin panel)

-- ============================================================
-- Verification Queries
-- ============================================================

-- SELECT id, name FROM categories ORDER BY id;
-- SELECT id, name, price, stock, unit, categoryId FROM products ORDER BY categoryId, id;
-- SELECT COUNT(*) AS total_products FROM products;
-- SELECT c.name AS category, COUNT(p.id) AS product_count FROM categories c LEFT JOIN products p ON p.categoryId = c.id GROUP BY c.id, c.name;


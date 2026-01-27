ALTER TABLE `products` DROP `is_active`;
ALTER TABLE `products` ADD `status` ENUM('active','inactive','draft','') NOT NULL AFTER `sale_price`;
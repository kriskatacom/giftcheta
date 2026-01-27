ALTER TABLE `products` DROP `currency`, DROP `old_price`;
ALTER TABLE `products` ADD `sale_price` DECIMAL(10,2) NULL AFTER `price`;
ALTER TABLE `products` ADD `order` INT NOT NULL AFTER `image`;

ALTER TABLE products CHANGE `order` sort_order INT;

DELIMITER $$

CREATE TRIGGER products_before_insert
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
    IF NEW.sort_order IS NULL THEN
        SET NEW.sort_order = (
            SELECT COALESCE(MAX(sort_order), 0) + 1
            FROM products
        );
    END IF;
END$$

DELIMITER ;

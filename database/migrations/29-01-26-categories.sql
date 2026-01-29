CREATE TABLE categories (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `heading` VARCHAR(255) DEFAULT NULL,
    `excerpt` TEXT DEFAULT NULL,
    `image` VARCHAR(255) DEFAULT NULL,
    `content` TEXT DEFAULT NULL,
    `parent_id` INT UNSIGNED DEFAULT NULL,
    `sort_order` INT(11) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

DELIMITER $$

CREATE TRIGGER categories_before_insert
BEFORE INSERT ON colors
FOR EACH ROW
BEGIN
    IF NEW.sort_order IS NULL OR NEW.sort_order <= 0 THEN
        SET NEW.sort_order = (
            SELECT COALESCE(MAX(sort_order), 0) + 1
            FROM colors
        );
    END IF;
END$$

DELIMITER ;

-- Главни категории
INSERT INTO categories (name, slug, heading, excerpt, parent_id)
VALUES 
('Подаръци за мъже', 'podaraci-za-maje', 'Подаръци за мъже', 'Идеи за подаръци за мъже', NULL),
('Подаръци за жени', 'podaraci-za-jeni', 'Подаръци за жени', 'Идеи за подаръци за жени', NULL),
('Деца', 'deca', 'Подаръци за деца', 'Играчки и подаръци за деца', NULL),
('Дом и декорация', 'dom-i-dekoracia', 'Дом и декорация', 'Подаръци за дома', NULL);

-- Подкатегории за "Подаръци за мъже"
INSERT INTO categories (name, slug, parent_id)
VALUES
('Аксесоари', 'aksesoari', 1),
('Гурме подаръци', 'gurme-podaraci', 1),
('Техника', 'tehnika', 1);

-- Подкатегории за "Подаръци за жени"
INSERT INTO categories (name, slug, parent_id)
VALUES
('Бижута', 'bijuta', 2),
('Парфюми', 'parfumi', 2),
('Козметика', 'kozmetika', 2);

-- Подкатегории за "Деца"
INSERT INTO categories (name, slug, parent_id)
VALUES
('Играчки', 'igrachki', 3),
('Книги', 'knigi', 3),
('Облекло', 'obleclo', 3);

-- Подкатегории за "Дом и декорация"
INSERT INTO categories (name, slug, parent_id)
VALUES
('Аксесоари за дома', 'aksesoari-za-doma', 4),
('Свещи и ароматерапия', 'sveshti-i-aromaterapia', 4),
('Декорации за стена', 'dekoracii-za-stena', 4);

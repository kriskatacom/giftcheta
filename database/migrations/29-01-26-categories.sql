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

INSERT INTO categories (name, slug, heading, excerpt, parent_id)
VALUES
('Свети Валентин', 'sveti-valentin', 'Подаръци за Свети Валентин', 'Романтични подаръци за любимата жена', NULL),
('8 март', '8-mart', 'Подаръци за 8 март', 'Нежни и стилни подаръци за жени', NULL),
('Рожден ден', 'rojden-den', 'Подаръци за рожден ден', 'Идеи за подарък за специален рожден ден', NULL),
('Имен ден', 'imen-den', 'Подаръци за имен ден', 'Оригинални подаръци за имен ден', NULL),
('Годишнина', 'godishnina', 'Подаръци за годишнина', 'Романтични подаръци за годишнини', NULL),
('Моминско парти', 'mominsko-parti', 'Подаръци за моминско парти', 'Забавни и стилни подаръци за моминско парти', NULL),
('Сватба', 'svatba', 'Подаръци за сватба', 'Елегантни подаръци за младоженци и булки', NULL),
('Коледа', 'koleda', 'Коледни подаръци', 'Празнични и уютни коледни подаръци', NULL),
('Нова година', 'nova-godina', 'Подаръци за Нова година', 'Стилни подаръци за ново начало', NULL),
('Великден', 'velikden', 'Великденски подаръци', 'Нежни и пролетни великденски идеи', NULL),
('Честито нов дом', 'chestito-nov-dom', 'Подаръци за нов дом', 'Практични и красиви подаръци за нов дом', NULL),
('Благодаря ти', 'blagodarya-ti', 'Подаръци „Благодаря ти“', 'Малки жестове с голямо значение', NULL),
('Обичам те', 'obicham-te', 'Подаръци „Обичам те“', 'Подаръци, които казват повече от думи', NULL),
('Извинявай', 'izvinyavai', 'Подаръци „Извинявай“', 'Нежен жест за важен момент', NULL),
('Честито повишение', 'chestito-povishenie', 'Подаръци за повишение', 'Елегантни подаръци за професионален успех', NULL);

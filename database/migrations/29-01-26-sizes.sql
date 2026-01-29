CREATE TABLE `giftcheta`.`sizes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `width` DECIMAL(10,2) NOT NULL,
    `height` DECIMAL(10,2) NOT NULL,
    `depth` DECIMAL(10,2) NOT NULL,
    `unit` ENUM('cm', 'inch', 'mm') DEFAULT 'cm',
    `sort_order` INT(11) NOT NULL,
);

-- Initial sizes
INSERT INTO `giftcheta`.`sizes` (`name`, `width`, `height`, `depth`, `unit`) VALUES
('Кутия за подарък малка', 20.00, 10.00, 5.00, 'cm'),
('Кутия за подарък средна', 30.00, 15.00, 10.00, 'cm'),
('Кутия за подарък голяма', 50.00, 25.00, 15.00, 'cm'),
('Ваза', 10.00, 25.00, 10.00, 'inch'),
('Плик за подарък', 300.00, 400.00, 50.00, 'mm');
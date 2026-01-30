CREATE TABLE
`giftcheta`.`colors` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `sort_order` INT(11) NOT NULL,
    PRIMARY KEY (`id`)
);

DELIMITER $$

CREATE TRIGGER colors_before_insert
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

CREATE TABLE product_colors (
    product_id BIGINT UNSIGNED NOT NULL,
    color_id INT NOT NULL,
    PRIMARY KEY (product_id, color_id),
    CONSTRAINT fk_product_colors_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_product_colors_color
        FOREIGN KEY (color_id) REFERENCES colors(id)
        ON DELETE CASCADE
);

-- Initial colors

INSERT INTO colors (name, code) VALUES
('Black', '#000000'),
('White', '#FFFFFF'),
('Red', '#FF0000'),
('Green', '#00FF00'),
('Blue', '#0000FF'),
('Yellow', '#FFFF00'),
('Orange', '#FFA500'),
('Purple', '#800080'),
('Pink', '#FFC0CB'),
('Brown', '#A52A2A'),
('Gray', '#808080'),
('Light Gray', '#D3D3D3'),
('Dark Gray', '#404040'),
('Cyan', '#00FFFF'),
('Magenta', '#FF00FF'),
('Lime', '#32CD32'),
('Navy', '#000080'),
('Teal', '#008080'),
('Olive', '#808000'),
('Maroon', '#800000');
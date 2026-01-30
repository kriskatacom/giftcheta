CREATE TABLE products (
    `id` SERIAL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `description` TEXT,
    `short_description` VARCHAR(500),
    `price` DECIMAL(10,2) NOT NULL,
    `currency` CHAR(3) DEFAULT 'EUR',
    `old_price` DECIMAL(10,2),
    `stock_quantity` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `category_id` INT,
    `tags` JSON,
    `image` NULL VARCHAR(512),
    `images` JSON,
    `is_featured` TINYINT(1) NOT NULL DEFAULT '0',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE product_sizes (
    product_id BIGINT UNSIGNED NOT NULL,
    size_id INT NOT NULL,

    PRIMARY KEY (product_id, size_id),

    CONSTRAINT fk_product_sizes_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_product_sizes_size
        FOREIGN KEY (size_id)
        REFERENCES sizes(id)
        ON DELETE CASCADE
);

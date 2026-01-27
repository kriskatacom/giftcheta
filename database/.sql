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
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

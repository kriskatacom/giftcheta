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

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    
    address TEXT NOT NULL,
    country VARCHAR(100) DEFAULT 'Bulgaria',
    
    notes TEXT,
    delivery_date TIMESTAMP NULL,
    
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    payment_method VARCHAR(50),
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BGN',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    
    user_id INT,
    guest BOOLEAN DEFAULT TRUE,
    
    tracking_number VARCHAR(100),
    shipping_provider VARCHAR(100),
    discount_code VARCHAR(50),
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    notes_internal TEXT,
    
    items JSON NOT NULL,
    
    gift BOOLEAN DEFAULT FALSE,
    gift_message TEXT,
    is_priority BOOLEAN DEFAULT FALSE,
    allow_marketing BOOLEAN DEFAULT FALSE,
    feedback_given BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT email_order_unique UNIQUE(email, order_number)
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_user_id ON orders(user_id);

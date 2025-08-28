<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use App\Models\Attribute;
use App\Models\AttributeValue;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // --- Създаваме категории ---
        $categories = [
            'Clothing' => Category::firstOrCreate(['name' => 'Clothing', 'slug' => 'clothing']),
            'Shoes' => Category::firstOrCreate(['name' => 'Shoes', 'slug' => 'shoes']),
        ];

        // --- Създаваме атрибути и стойности ---
        $sizes = Attribute::firstOrCreate(['name' => 'Size']);
        $colors = Attribute::firstOrCreate(['name' => 'Color']);

        foreach (['S', 'M', 'L', 'XL'] as $size) {
            AttributeValue::firstOrCreate(['attribute_id' => $sizes->id, 'value' => $size]);
        }

        foreach (['Red', 'Blue', 'Black', 'White'] as $color) {
            AttributeValue::firstOrCreate(['attribute_id' => $colors->id, 'value' => $color]);
        }

        // --- Създаваме 20 продукта с категории, изображения и атрибути ---
        for ($i = 1; $i <= 20; $i++) {
            $product = Product::create([
                'name' => "Product $i",
                'slug' => "product-$i",
                'description' => "Description for product $i",
                'short_description' => "Short desc $i",
                'price' => rand(10, 100),
                'sale_price' => rand(5, 50),
                'type' => 'simple',
                'sku' => "SKU-$i",
                'manage_stock' => true,
                'stock_quantity' => rand(10, 100),
                'in_stock' => true,
                'featured' => rand(0,1),
            ]);

            // Свързваме продукт с категории (много към много)
            $product->categories()->attach($categories['Clothing']->id);
            if ($i % 2 == 0) {
                $product->categories()->attach($categories['Shoes']->id);
            }

            // Свързваме продукт с атрибути (много към много)
            $product->attributes()->attach([$sizes->id, $colors->id]);

            // Добавяме няколко изображения
            ProductImage::create([
                'product_id' => $product->id,
                'url' => "https://picsum.photos/seed/product{$i}/600/400",
                'is_featured' => true
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'url' => "https://picsum.photos/seed/product{$i}a/600/400",
                'is_featured' => false
            ]);
        }
    }
}
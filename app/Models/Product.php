<?php

namespace App\Models;

use File;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'sale_price',
        'type',
        'sku',
        'manage_stock',
        'stock_quantity',
        'in_stock',
        'featured'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function attributes()
    {
        return $this->belongsToMany(Attribute::class);
    }

    public function featuredImage()
    {
        return $this->images()->where('is_featured', true)->first();
    }

    public function getFeaturedImageUrlAttribute()
    {
        return $this->featuredImage()->url ?? '/images/product-demo.png';
    }

    public function galleryImages()
    {
        return $this->images()->where('is_featured', false)->get();
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($product) {
            foreach ($product->images as $image) {
                $imagePath = public_path($image->url);
                if (File::exists($imagePath)) {
                    File::delete($imagePath);
                }
            }

            $product->images()->delete();
        });
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;

class IndexController extends Controller
{
    public function home()
    {
        $featuredProducts = Product::where('featured', 1)->orderBy('name', 'asc')->get();
        $latestProducts = Product::orderBy("created_at","desc")->get();
        $categories = Category::whereNull('parent_id')->orderBy('name', 'desc')->get();
        return view("index.home", compact("featuredProducts", "categories", "latestProducts"));
    }

    public function search()
    {
        $products = Product::all();
        $categories = Category::all();
        return view("index.search", compact("products", "categories"));
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

class AdminController extends Controller
{
    public function dashboard()
    {
        $products = Product::count();
        $categories = Category::count();
        $users = User::count();

        return view("admin.dashboard", compact("products", "categories", "users"));
    }
}

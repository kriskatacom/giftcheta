<?php

use App\Http\Controllers\IndexController;
use Illuminate\Support\Facades\Route;

Route::get("/", [IndexController::class, "home"])->name("home");
Route::get("/search", [IndexController::class, "search"])->name("search");
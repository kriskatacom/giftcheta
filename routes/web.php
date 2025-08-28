<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// index routes
Route::get("/", [IndexController::class, "home"])->name("home");
Route::get("/search", [IndexController::class, "search"])->name("search");

// users routes
Route::get("/users/login", [UserController::class, "login"])->name("users.login");
Route::get("/users/register", [UserController::class, "register"])->name("users.register");
Route::get("/users/forgot-password", [UserController::class, "forgotPassword"])->name("users.password.request");
Route::get("/users/profile", [UserController::class, "profile"])->name("users.profile");
Route::get("/users/orders", [UserController::class, "orders"])->name("users.orders");
Route::get("/users/settings", [UserController::class, "settings"])->name("users.settings");

Route::post("/users/authenticate", [UserController::class, "authenticate"])->name("users.authenticate");
Route::post("/users/create", [UserController::class, "create"])->name("users.create");
Route::post("/users/password-change", [UserController::class, "changePassword"])->name("users.password.change");
Route::post("/users/general-info-change", [UserController::class, "changeGeneralInfo"])->name("users.general-info.change");

Route::delete("/users/logout", [UserController::class, "logout"])->name("users.logout");

// forgot password
Route::get("/users/forgot-password", [UserController::class, "forgotPassword"])->name("password.request");
Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');

Route::post("/users/forgot-password", [UserController::class, "sendResetLinkEmail"])->name("password.email");
Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');


// admin
Route::get('/admin', [AdminController::class, 'dashboard'])->middleware('role:admin')->name("admin.dashboard");
Route::get('/settings', [AdminController::class, 'settings'])->middleware('role:admin')->name("admin.settings");
Route::get('/admin/users', [UserController::class, 'all'])->middleware('role:admin')->name("admin.users");
Route::get('/admin/categories', [CategoryController::class, 'all'])->middleware('role:admin')->name("admin.categories");
Route::get('/admin/orders', [OrderController::class, 'all'])->middleware('role:admin')->name("admin.orders");
Route::get('/admin/stats', [AdminController::class, 'stats'])->middleware('role:admin')->name("admin.stats");
Route::get('/admin/products', [ProductController::class, 'all'])->middleware('role:admin')->name("admin.products");

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| Public routes (Index)
|--------------------------------------------------------------------------
*/
Route::get('/', [IndexController::class, 'home'])->name('home'); // Начална страница
Route::get('/search', [IndexController::class, 'search'])->name('search'); // Търсене


/*
|--------------------------------------------------------------------------
| User routes (Authentication & Profile)
|--------------------------------------------------------------------------
*/
Route::prefix('users')->group(function () {
    // Аутентикация
    Route::get('/login', [UserController::class, 'login'])->name('users.login');
    Route::get('/register', [UserController::class, 'register'])->name('users.register');
    Route::post('/authenticate', [UserController::class, 'authenticate'])->name('users.authenticate');
    Route::post('/create', [UserController::class, 'create'])->name('users.create');
    Route::delete('/logout', [UserController::class, 'logout'])->name('users.logout');

    // Забравена парола
    Route::get('/forgot-password', [UserController::class, 'forgotPassword'])->name('users.password.request');
    Route::post('/forgot-password', [UserController::class, 'sendResetLinkEmail'])->name('password.email');

    // Профил & настройки
    Route::get('/profile', [UserController::class, 'profile'])->name('users.profile');
    Route::get('/orders', [UserController::class, 'orders'])->name('users.orders');
    Route::get('/settings', [UserController::class, 'settings'])->name('users.settings');

    // Промени по данни
    Route::post('/password-change', [UserController::class, 'changePassword'])->name('users.password.change');
    Route::post('/{id}/general-info-change', [UserController::class, 'changeGeneralInfo'])->name('users.general-info.change');
});

// Reset password
Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');


/*
|--------------------------------------------------------------------------
| Admin routes (only for role:admin)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware('role:admin')->group(function () {
    // Dashboard & settings
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::get('/stats', [AdminController::class, 'stats'])->name('admin.stats');

    // Users
    Route::get('/users', [UserController::class, 'all'])->name('admin.users');
    Route::get('/users/{id}/show', [UserController::class, 'show'])->name('admin.users.show');
    Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::post('/users/{id}/general-info-change', [UserController::class, 'changeGeneralInfo'])->name('admin.users.general-info.change');
    Route::delete('/users/{id}/destroy', [UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::delete('/users/destroy-all', [UserController::class, 'destroyAll'])->name('admin.users.destroy-all');

    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('admin.products');
    Route::get('/products/create', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('/products/create', [ProductController::class, 'store'])->name('admin.product.store');
    Route::get('/products/{id}/show', [ProductController::class, 'show'])->name('admin.products.show');
    Route::get('/products/{id}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
    Route::delete('/products/destroy-all', [ProductController::class, 'destroyAll'])->name('admin.products.destroy-all');
    Route::delete('/products/{id}/destroy', [ProductController::class, 'destroy'])->name('admin.products.destroy');

    // Categories
    Route::get('/categories', [CategoryController::class, 'all'])->name('admin.categories');

    // Orders
    Route::get('/orders', [OrderController::class, 'all'])->name('admin.orders');
});

<?php

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

Route::post("/users/authenticate", [UserController::class, "authenticate"])->name("users.authenticate");
Route::post("/users/create", [UserController::class, "create"])->name("users.create");

// forgot password
Route::get("/users/forgot-password", [UserController::class, "forgotPassword"])->name("password.request");
Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');

Route::post("/users/forgot-password", [UserController::class, "sendResetLinkEmail"])->name("password.email");
Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update');

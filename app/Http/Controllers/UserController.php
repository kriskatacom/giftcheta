<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Models\User;

class UserController extends Controller
{
    public function login()
    {
        return view("users.login", ["title" => "Вход в профила"]);
    }

    public function register()
    {
        return view("users.register", ["title" => "Създаване на профил"]);
    }

    public function forgotPassword()
    {
        return view("users.forgot-password", ["title" => "Забравена парола"]);
    }
    
    public function profile()
    {
        return view("users.profile", ["title" => "Моят профил"]);
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ], [
            'email.required' => 'Полето "Имейл адрес" е задължително.',
            'email.email' => 'Моля, въведете валиден имейл адрес.',
            'password.required' => 'Полето "Парола" е задължително.',
        ]);

        if (auth()->attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'Имейл адресът или паролата са невалидни.',
        ])->onlyInput('email');
    }

    public function create(Request $request)
    {
        $request->validate([
            "fullname" => "required|string|max:255",
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'fullname.required' => 'Моля, въведете вашето име и фамилия.',
            'fullname.max' => 'Името не може да е повече от 255 символа.',
            'email.required' => 'Моля, въведете имейл адрес.',
            'email.email' => 'Въведеният имейл е невалиден.',
            'email.unique' => 'Този имейл вече е регистриран.',
            'password.required' => 'Моля, въведете парола.',
            'password.min' => 'Паролата трябва да е поне 6 символа.',
            'password.confirmed' => 'Паролите не съвпадат.',
        ]);

        User::create([
            "fullname" => $request->fullname,
            "email" => $request->email,
            "password" => password_hash($request->password, PASSWORD_DEFAULT),
        ]);

        return redirect("/users/login")->with("success", "Създаването на профила беше успешно!");
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ], [
            'email.required' => 'Моля, въведете имейл адрес.',
            'email.email' => 'Въведеният имейл е невалиден.',
        ]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('success', 'Изпратихме ви линк за смяна на паролата на посочения имейл адрес.');
        }

        return back()->with('error', 'Не успяхме да намерим потребител с този имейл адрес.');
    }
}

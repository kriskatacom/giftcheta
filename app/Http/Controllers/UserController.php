<?php

namespace App\Http\Controllers;

use App\Mail\ResetPasswordMail;
use Auth;
use DB;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password as PasswordRule;
use App\Models\User;
use Mail;
use Str;

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

    public function orders()
    {
        return view("users.orders", ["title" => "Поръчки"]);
    }

    public function settings()
    {
        return view("users.settings", ["title" => "Настройки"]);
    }

    public function all()
    {
        $users = User::orderBy("created_at", "desc")->paginate(10);
        return view("admin.users.index", compact("users"));
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
            'password' => ['required', 'confirmed', PasswordRule::min(8)]
        ], [
            'fullname.required' => 'Моля, въведете вашето име и фамилия.',
            'fullname.max' => 'Името не може да е повече от 255 символа.',
            'email.required' => 'Моля, въведете имейл адрес.',
            'email.email' => 'Въведеният имейл е невалиден.',
            'email.unique' => 'Този имейл вече е регистриран.',
            'password.required' => 'Моля, въведете парола.',
            'password.min' => 'Паролата трябва да е поне 8 символа.',
            'password.confirmed' => 'Паролите не съвпадат.',
        ]);

        User::create([
            "fullname" => $request->fullname,
            "gender" => $request->gender,
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

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->with('error', 'Не успяхме да намерим потребител с този имейл адрес.');
        }

        $token = Str::random(64);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        Mail::to($user->email)->send(new ResetPasswordMail($token, $user->email));

        return back()->with('success', 'Изпратихме ви линк за смяна на паролата на посочения имейл адрес.');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('users.login')->with('success', 'Успешно излязохте от профила си.');
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ], [
            'current_password.required' => 'Моля, въведете текущата си парола.',
            'password.required' => 'Моля, въведете новата парола.',
            'password.confirmed' => 'Паролите не съвпадат.',
            'password.min' => 'Паролата трябва да е поне 8 символа.',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Текущата парола е неправилна.']);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return back()->with('success', 'Паролата беше сменена успешно.');
    }

    public function changeGeneralInfo(Request $request)
    {
        $request->validate([
            "fullname" => "required|string|max:255",
            "gender" => "nullable|in:male,female,other",
            "phone" => "nullable|string|max:20",
            "birthday" => "nullable|date",
        ], [
            'fullname.required' => 'Моля, въведете вашето име и фамилия.',
            'fullname.max' => 'Името не може да е повече от 255 символа.',
            'gender.in' => 'Избраният пол е невалиден.',
            'phone.max' => 'Телефонният номер не може да е повече от 20 символа.',
            'birthday.date' => 'Въведената дата е невалидна.',
        ]);

        $user = Auth::user();

        $user->fullname = $request->input('fullname');
        $user->gender = $request->input('gender');
        $user->phone = $request->input('phone');
        $user->birthday = $request->input('birthday');
        $user->save();

        return back()->with('success', 'Информацията беше успешно обновена.');
    }
}
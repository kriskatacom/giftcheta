<?php

namespace App\Http\Controllers;

class IndexController extends Controller
{
    public function home()
    {
        return view("index.home", [
            "title" => "Начало"
        ]);
    }

    public function search()
    {
        return view("index.search", [
            "title" => "Резултати от търсенето"
        ]);
    }
}
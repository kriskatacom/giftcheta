<?php

if (! function_exists('gender_label')) {
    function gender_label(?string $gender): string
    {
        return match($gender) {
            'male' => 'Мъж',
            'female' => 'Жена',
            'other' => 'Друго',
            null, '' => 'Не е посочен',
            default => 'Неизвестен',
        };
    }
}
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

if (! function_exists('format_bgn')) {
    function format_bgn(float $amount, int $decimals = 2): string
    {
        return number_format($amount, $decimals, ',', ' ') . ' лв.';
    }
}

if (! function_exists('format_eur')) {
    function format_eur(float $amount, int $decimals = 2): string
    {
        $eurRate = 1.95583;

        $eur = $amount / $eurRate;

        return number_format($eur, $decimals, ',', ' ') . ' €';
    }
}

if (! function_exists('format_price')) {
    function format_price(float $amount, int $decimals = 2): string
    {
        return sprintf(
            '<span>%s</span><span> | </span><span>%s</span>',
            format_bgn($amount, $decimals),
            format_eur($amount, $decimals)
        );
    }
}

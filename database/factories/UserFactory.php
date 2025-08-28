<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition()
    {
        return [
            'fullname' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'phone' => $this->faker->phoneNumber(),
            'birthday' => $this->faker->date('Y-m-d', '2005-01-01'),
            'role' => $this->faker->randomElement(['user', 'admin']),
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified()
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
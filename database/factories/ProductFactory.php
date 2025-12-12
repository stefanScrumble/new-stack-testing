<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $minStock = fake()->numberBetween(0, 50);

        return [
            'title' => fake()->words(3, true),
            'min_stock' => $minStock,
            'max_stock' => fake()->numberBetween($minStock + 1, $minStock + 200),
            'weight' => fake()->randomFloat(2, 0.1, 250),
            'dimensions' => sprintf(
                '%dx%dx%d cm',
                fake()->numberBetween(5, 80),
                fake()->numberBetween(5, 80),
                fake()->numberBetween(5, 80),
            ),
            'color' => fake()->safeColorName(),
        ];
    }
}

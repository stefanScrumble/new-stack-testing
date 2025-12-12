<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseInventorySeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::factory(40)->create();
        $warehouses = Warehouse::factory(23)->create();

        $warehouses->each(function (Warehouse $warehouse) use ($products): void {
            $selection = $products->random(fake()->numberBetween(5, 15));
            $warehouse->products()->syncWithoutDetaching(
                $selection->mapWithKeys(
                    fn (Product $product) => [
                        $product->id => ['quantity' => fake()->numberBetween(1, 250)],
                    ],
                ),
            );
        });
    }
}

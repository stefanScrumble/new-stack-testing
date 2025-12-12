<?php

namespace Tests\Feature\Inventory;

use App\Models\Product;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_product_with_warehouses(): void
    {
        $user = User::factory()->create();
        $warehouseA = Warehouse::factory()->create();
        $warehouseB = Warehouse::factory()->create();
        $minStock = fake()->numberBetween(0, 10);
        $maxStock = fake()->numberBetween($minStock + 1, $minStock + 30);
        $firstQuantity = fake()->numberBetween(1, 25);
        $secondQuantity = fake()->numberBetween(1, 25);

        $payload = [
            'title' => fake()->words(3, true),
            'min_stock' => $minStock,
            'max_stock' => $maxStock,
            'weight' => fake()->randomFloat(2, 0.5, 50),
            'dimensions' => fake()->numerify('##x##x## cm'),
            'color' => fake()->safeColorName(),
            'warehouses' => [
                ['warehouse_id' => $warehouseA->id, 'quantity' => $firstQuantity],
                ['warehouse_id' => $warehouseB->id, 'quantity' => $secondQuantity],
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->post(route('inventory.store'), $payload);

        $response->assertRedirect(route('inventory.index'));

        $this->assertDatabaseHas('products', [
            'title' => $payload['title'],
            'min_stock' => $minStock,
            'max_stock' => $maxStock,
            'color' => $payload['color'],
        ]);

        $product = Product::where('title', $payload['title'])->first();
        self::assertNotNull($product);

        $this->assertDatabaseHas('product_warehouse', [
            'product_id' => $product->id,
            'warehouse_id' => $warehouseA->id,
            'quantity' => $firstQuantity,
        ]);
        $this->assertDatabaseHas('product_warehouse', [
            'product_id' => $product->id,
            'warehouse_id' => $warehouseB->id,
            'quantity' => $secondQuantity,
        ]);
    }

    public function test_user_can_update_product_and_sync_warehouses(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $currentWarehouse = Warehouse::factory()->create();
        $replacementWarehouse = Warehouse::factory()->create();
        $additionalWarehouse = Warehouse::factory()->create();
        $product->warehouses()->attach($currentWarehouse->id, ['quantity' => fake()->numberBetween(1, 15)]);
        $minStock = fake()->numberBetween(1, 5);
        $maxStock = fake()->numberBetween($minStock + 5, $minStock + 40);
        $newQuantity = fake()->numberBetween(1, 20);
        $secondNewQuantity = fake()->numberBetween(1, 20);

        $payload = [
            'title' => fake()->words(2, true),
            'min_stock' => $minStock,
            'max_stock' => $maxStock,
            'weight' => fake()->randomFloat(2, 1, 25),
            'dimensions' => fake()->numerify('##x##x## cm'),
            'color' => fake()->safeColorName(),
            'warehouses' => [
                ['warehouse_id' => $replacementWarehouse->id, 'quantity' => $newQuantity],
                ['warehouse_id' => $additionalWarehouse->id, 'quantity' => $secondNewQuantity],
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->put(route('inventory.update', $product), $payload);

        $response->assertRedirect(route('inventory.index'));

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'title' => $payload['title'],
            'max_stock' => $maxStock,
        ]);
        $this->assertDatabaseHas('product_warehouse', [
            'product_id' => $product->id,
            'warehouse_id' => $replacementWarehouse->id,
            'quantity' => $newQuantity,
        ]);
        $this->assertDatabaseHas('product_warehouse', [
            'product_id' => $product->id,
            'warehouse_id' => $additionalWarehouse->id,
            'quantity' => $secondNewQuantity,
        ]);
        $this->assertDatabaseMissing('product_warehouse', [
            'product_id' => $product->id,
            'warehouse_id' => $currentWarehouse->id,
        ]);
    }
}

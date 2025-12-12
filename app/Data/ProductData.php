<?php

namespace App\Data;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ProductData extends Data
{
    public function __construct(
        public int $id,
        public string $title,
        public int $min_stock,
        public int $max_stock,
        public float $weight,
        public string $dimensions,
        public string $color,
        public int $total_quantity,
        public DataCollection|Collection $warehouses,
        public ?string $created_at,
    ) {
    }

    public static function fromModel(Product $product): self
    {
        $warehouses = WarehouseData::collect(
            $product->relationLoaded('warehouses') ? $product->warehouses : [],
        );
        $totalQuantity = $product->total_quantity
            ?? ($product->relationLoaded('warehouses')
                ? $product->warehouses->sum(fn ($warehouse) => (int) $warehouse->pivot?->quantity)
                : 0);

        return new self(
            $product->id,
            $product->title,
            $product->min_stock,
            $product->max_stock,
            (float) $product->weight,
            $product->dimensions,
            $product->color,
            (int) $totalQuantity,
            $warehouses,
            $product->created_at?->toISOString(),
        );
    }
}

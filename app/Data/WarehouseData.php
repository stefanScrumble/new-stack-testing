<?php

namespace App\Data;

use App\Models\Warehouse;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class WarehouseData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?int $quantity,
    ) {
    }

    public static function fromModel(Warehouse $warehouse): self
    {
        return new self(
            $warehouse->id,
            $warehouse->name,
            $warehouse->pivot?->quantity !== null
                ? (int) $warehouse->pivot->quantity
                : null,
        );
    }
}

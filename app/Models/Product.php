<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'min_stock',
        'max_stock',
        'weight',
        'dimensions',
        'color',
    ];

    protected $casts = [
        'min_stock' => 'integer',
        'max_stock' => 'integer',
        'weight' => 'decimal:2',
    ];

    public function warehouses(): BelongsToMany
    {
        return $this->belongsToMany(Warehouse::class)
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function scopeTotalQuantityEquals(Builder $query, mixed $value): Builder
    {
        if ($value === null || $value === '') {
            return $query;
        }

        return $query->whereIn('id', function ($sub) use ($value): void {
            $sub
                ->select('product_id')
                ->from('product_warehouse')
                ->groupBy('product_id')
                ->havingRaw('sum(quantity) = ?', [(int) $value]);
        });
    }

    public function scopeInWarehouses(Builder $query, mixed $value): Builder
    {
        $ids = is_string($value)
            ? array_filter(explode(',', $value))
            : (array) $value;
        $ids = collect($ids)->filter()->map(fn ($id) => (int) $id)->values();

        if ($ids->isEmpty()) {
            return $query;
        }

        return $query->whereHas(
            'warehouses',
            fn (Builder $warehouseQuery) => $warehouseQuery->whereIn('warehouses.id', $ids),
            '>=',
            $ids->count(),
        );
    }

    public function scopeBelowMinimum(Builder $query, mixed $value): Builder
    {
        if ($value === null || $value === '' || $value === '0' || $value === 0) {
            return $query;
        }

        return $query->whereRaw(
            'coalesce((select sum(quantity) from product_warehouse where product_warehouse.product_id = products.id), 0) < products.min_stock',
        );
    }
}

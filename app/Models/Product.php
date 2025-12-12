<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
}

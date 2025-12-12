<?php

namespace App\Http\Controllers;

use App\Data\ProductData;
use App\Data\WarehouseData;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = QueryBuilder::for(
            Product::query()
                ->with(['warehouses' => fn ($query) => $query->orderBy('name')])
                ->withSum('warehouses as total_quantity', 'product_warehouse.quantity'),
        )
            ->allowedSorts([
                'id',
                'title',
                'min_stock',
                'max_stock',
                'weight',
                'created_at',
                AllowedSort::field('total_quantity'),
            ])
            ->allowedFilters([
                AllowedFilter::exact('id'),
                AllowedFilter::partial('title'),
                AllowedFilter::exact('color'),
                AllowedFilter::exact('min_stock'),
                AllowedFilter::exact('max_stock'),
                AllowedFilter::scope('total_quantity', 'total_quantity_equals'),
                AllowedFilter::exact('created_on'),
                AllowedFilter::scope('warehouses', 'in_warehouses'),
                AllowedFilter::scope('below_minimum'),
            ])
            ->defaultSort('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('inventory/index', [
            'products' => ProductData::collect($products),
            'sort' => request('sort', 'id'),
            'filters' => request('filter', []),
            'filterableWarehouses' => WarehouseData::collect(
                Warehouse::query()->orderBy('name')->get(),
            ),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/create', [
            'warehouses' => WarehouseData::collect(
                Warehouse::query()->orderBy('name')->get(),
            ),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $product = Product::create($request->safe()->except('warehouses'));
        $this->syncWarehouses($product, $request->validated('warehouses') ?? []);

        return redirect()
            ->route('inventory.index')
            ->with('success', 'Product created.');
    }

    public function edit(Product $product): Response
    {
        $product->load(['warehouses' => fn ($query) => $query->orderBy('name')]);

        return Inertia::render('inventory/edit', [
            'product' => ProductData::from($product),
            'warehouses' => WarehouseData::collect(
                Warehouse::query()->orderBy('name')->get(),
            ),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->safe()->except('warehouses'));
        $this->syncWarehouses($product, $request->validated('warehouses') ?? []);

        return redirect()
            ->route('inventory.index')
            ->with('success', 'Product updated.');
    }

    private function syncWarehouses(Product $product, array $warehouses): void
    {
        $product->warehouses()->sync(
            collect($warehouses)->mapWithKeys(
                fn (array $warehouse) => [
                    $warehouse['warehouse_id'] => ['quantity' => $warehouse['quantity']],
                ],
            ),
        );
    }
}

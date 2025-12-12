<?php

namespace App\Http\Controllers;

use App\Data\ProductData;
use App\Data\WarehouseData;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->with(['warehouses' => fn ($query) => $query->orderBy('name')])
            ->withSum('warehouses as total_quantity', 'product_warehouse.quantity')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('inventory/index', [
            'products' => ProductData::collect($products),
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

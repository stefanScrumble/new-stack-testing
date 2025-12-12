<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'min_stock' => ['required', 'integer', 'min:0'],
            'max_stock' => ['required', 'integer', 'gte:min_stock'],
            'weight' => ['required', 'numeric', 'min:0'],
            'dimensions' => ['required', 'string', 'max:255'],
            'color' => ['required', 'string', 'max:100'],
            'warehouses' => ['sometimes', 'array'],
            'warehouses.*.warehouse_id' => [
                'required',
                'integer',
                'exists:warehouses,id',
                'distinct',
            ],
            'warehouses.*.quantity' => ['required', 'integer', 'min:0'],
        ];
    }
}

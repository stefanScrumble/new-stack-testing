import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { FieldGroup } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import type { RouteDefinition } from '@/wayfinder';

type WarehouseEntry = {
    warehouse_id: number | '';
    quantity: number | '';
};

type InventoryFormData = {
    title: string;
    min_stock: number | string;
    max_stock: number | string;
    weight: number | string;
    dimensions: string;
    color: string;
    warehouses: WarehouseEntry[];
};

type InventoryFormProps = Readonly<{
    product?: App.Data.ProductData;
    warehouses: App.Data.WarehouseData[];
    submitAction: RouteDefinition<'post' | 'put'>;
    submitLabel: string;
    cancelHref: string;
}>;

export function InventoryForm({
    product,
    warehouses,
    submitAction,
    submitLabel,
    cancelHref,
}: InventoryFormProps) {
    const initialWarehouses =
        product?.warehouses?.map((warehouse) => ({
            warehouse_id: warehouse.id,
            quantity: warehouse.quantity ?? 0,
        })) ?? (warehouses.length ? [{ warehouse_id: '', quantity: '' }] : []);

    const form = useForm<InventoryFormData>({
        title: product?.title ?? '',
        min_stock: product?.min_stock ?? '',
        max_stock: product?.max_stock ?? '',
        weight: product?.weight ?? '',
        dimensions: product?.dimensions ?? '',
        color: product?.color ?? '',
        warehouses: initialWarehouses,
    });

    const updateWarehouse = (
        index: number,
        key: keyof WarehouseEntry,
        value: number | '',
    ) => {
        const next = [...form.data.warehouses];
        next[index] = {...next[index], [key]: value};
        form.setData('warehouses', next);
    };

    const addWarehouseRow = () =>
        form.setData('warehouses', [
            ...form.data.warehouses,
            { warehouse_id: '', quantity: '' },
        ]);

    const removeWarehouseRow = (index: number) =>
        form.setData(
            'warehouses',
            form.data.warehouses.filter((_, current) => current !== index),
        );

    const sanitizeWarehouses = () =>
        form.data.warehouses
            .filter(({ warehouse_id }) => warehouse_id !== '')
            .map((warehouse) => ({
                warehouse_id: Number(warehouse.warehouse_id),
                quantity: Number(warehouse.quantity || 0),
            }));

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const warehousesPayload = sanitizeWarehouses();
        form.transform((data) => ({
            ...data,
            warehouses: warehousesPayload,
        }));

        form.submit(submitAction.method ?? 'post', submitAction.url, {
            preserveScroll: true,
            onFinish: () => form.transform((data) => data),
        });
    };

    const warehouseError = (
        index: number,
        key: keyof WarehouseEntry,
    ): string | undefined =>
        form.errors[
            `warehouses.${index}.${key}` as keyof typeof form.errors
        ];

    return (
        <form
            onSubmit={submit}
            className="w-full max-w-4xl space-y-6 p-4"
        >
            <FieldGroup className="grid gap-6 md:grid-cols-2">
                <FormField
                    label="Title"
                    name="title"
                    value={form.data.title}
                    onChange={(event) => form.setData('title', event.target.value)}
                    required
                    error={form.errors.title}
                />
                <FormField
                    label="Color"
                    name="color"
                    value={form.data.color}
                    onChange={(event) => form.setData('color', event.target.value)}
                    required
                    error={form.errors.color}
                />
                <FormField
                    label="Minimum stock"
                    name="min_stock"
                    type="number"
                    min={0}
                    value={form.data.min_stock}
                    onChange={(event) => form.setData('min_stock', event.target.value)}
                    required
                    error={form.errors.min_stock}
                />
                <FormField
                    label="Maximum stock"
                    name="max_stock"
                    type="number"
                    min={form.data.min_stock || 0}
                    value={form.data.max_stock}
                    onChange={(event) => form.setData('max_stock', event.target.value)}
                    required
                    error={form.errors.max_stock}
                />
                <FormField
                    label="Weight"
                    name="weight"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.data.weight}
                    onChange={(event) => form.setData('weight', event.target.value)}
                    required
                    error={form.errors.weight}
                />
                <FormField
                    label="Dimensions"
                    name="dimensions"
                    placeholder="10x20x30 cm"
                    value={form.data.dimensions}
                    onChange={(event) =>
                        form.setData('dimensions', event.target.value)
                    }
                    required
                    error={form.errors.dimensions}
                />
            </FieldGroup>

            <div className="space-y-4 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold">Warehouses</h3>
                        <p className="text-sm text-muted-foreground">
                            Assign available stock per location.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addWarehouseRow}
                        disabled={!warehouses.length}
                    >
                        Add location
                    </Button>
                </div>
                {!warehouses.length && (
                    <p className="text-sm text-muted-foreground">
                        Add a warehouse first to track stock.
                    </p>
                )}
                <div className="flex flex-col gap-3">
                    {form.data.warehouses.map((warehouse, index) => (
                        <div
                            key={`${warehouse.warehouse_id}-${index}`}
                            className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[2fr_1fr_auto]"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Warehouse
                                </label>
                                <Select
                                    value={
                                        warehouse.warehouse_id === ''
                                            ? ''
                                            : warehouse.warehouse_id.toString()
                                    }
                                    onValueChange={(value) =>
                                        updateWarehouse(
                                            index,
                                            'warehouse_id',
                                            value === '' ? '' : Number(value),
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        aria-invalid={!!warehouseError(index, 'warehouse_id')}
                                    >
                                        <SelectValue placeholder="Select warehouse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map((option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={option.id.toString()}
                                            >
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {warehouseError(index, 'warehouse_id') && (
                                    <p className="text-sm text-destructive">
                                        {warehouseError(index, 'warehouse_id')}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Quantity
                                </label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={warehouse.quantity}
                                    onChange={(event) =>
                                        updateWarehouse(
                                            index,
                                            'quantity',
                                            event.target.value === ''
                                                ? ''
                                                : Number(event.target.value),
                                        )
                                    }
                                    aria-invalid={!!warehouseError(index, 'quantity')}
                                />
                                {warehouseError(index, 'quantity') && (
                                    <p className="text-sm text-destructive">
                                        {warehouseError(index, 'quantity')}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-start justify-end pt-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => removeWarehouseRow(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    {!form.data.warehouses.length && warehouses.length > 0 && (
                        <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                            No warehouse allocations yet.
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    type="submit"
                    disabled={form.processing}
                    className="min-w-[140px]"
                >
                    {form.processing ? `${submitLabel}...` : submitLabel}
                </Button>
                <Button asChild variant="outline">
                    <Link href={cancelHref}>Cancel</Link>
                </Button>
                {form.recentlySuccessful && (
                    <span className="text-sm text-green-600">Saved</span>
                )}
            </div>
        </form>
    );
}

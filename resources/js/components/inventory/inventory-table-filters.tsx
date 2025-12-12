import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import type { InventoryFilters } from './inventory-table';

type InventoryFilterSheetProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    filters: InventoryFilters;
    onChange: (filters: InventoryFilters) => void;
    onApply: () => void;
    warehouses: App.Data.WarehouseData[];
};

const filterFields: {
    key: keyof InventoryFilters;
    label: string;
    type?: 'text' | 'number' | 'date';
}[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'title', label: 'Title' },
    { key: 'color', label: 'Color' },
    { key: 'min_stock', label: 'Min stock', type: 'number' },
    { key: 'max_stock', label: 'Max stock', type: 'number' },
    { key: 'total_quantity', label: 'Quantity', type: 'number' },
    { key: 'weight', label: 'Weight', type: 'number' },
    { key: 'created_at', label: 'Created on', type: 'date' },
];

export default function InventoryFilterSheet({
    open,
    onOpenChange,
    filters,
    onChange,
    onApply,
    warehouses,
}: InventoryFilterSheetProps) {
    const updateFilter = (key: keyof InventoryFilters, value: string) =>
        onChange({ ...filters, [key]: value });

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="max-w-md">
                <SheetHeader>
                    <SheetTitle>Filter inventory</SheetTitle>
                </SheetHeader>
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
                    <div className="grid grid-cols-1 gap-4">
                        {filterFields.map(({ key, label, type }) => (
                            <div key={key} className="flex flex-col gap-2">
                                <label
                                    className="text-sm font-medium text-foreground"
                                    htmlFor={`filter-${key}`}
                                >
                                    {label}
                                </label>
                                <Input
                                    id={`filter-${key}`}
                                    type={type ?? 'text'}
                                    value={filters[key] ?? ''}
                                    onChange={(event) =>
                                        updateFilter(key, event.target.value)
                                    }
                                />
                            </div>
                        ))}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground">
                                Warehouses
                            </label>
                            <MultiSelect
                                options={warehouses.map((warehouse) => ({
                                    label: warehouse.name,
                                    value: warehouse.id.toString(),
                                }))}
                                value={
                                    Array.isArray(filters.warehouses)
                                        ? filters.warehouses
                                        : filters.warehouses
                                            ? String(filters.warehouses)
                                                  .split(',')
                                                  .filter(Boolean)
                                            : []
                                }
                                onChange={(values) =>
                                    onChange({
                                        ...filters,
                                        warehouses: values,
                                    })
                                }
                                placeholder="Select warehouses"
                            />
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <Button onClick={onApply}>Apply filters</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

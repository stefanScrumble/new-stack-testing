import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type SortingState,
} from '@tanstack/react-table';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { edit as editProduct, index as inventoryIndex } from '@/actions/App/Http/Controllers/ProductController';
import InventoryFilterSheet from './inventory-table-filters';
import { useEventListener } from '@/hooks/use-event-listener';

export type InventoryProduct = App.Data.ProductData;

type InventoryColumnKey =
    | 'id'
    | 'title'
    | 'min_stock'
    | 'max_stock'
    | 'total_quantity'
    | 'weight'
    | 'created_at';

type PaginationLink = { url: string | null; label: string; active: boolean };

type WarehouseFilter = string[] | string | undefined;
export type InventoryFilters = {
    id?: string;
    title?: string;
    color?: string;
    min_stock?: string;
    max_stock?: string;
    total_quantity?: string;
    weight?: string;
    created_at?: string;
    warehouses?: WarehouseFilter;
    below_minimum?: string;
};

export type PaginatedProducts = {
    data: InventoryProduct[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

const columnHelper = createColumnHelper<InventoryProduct>();

const sortableColumns: InventoryColumnKey[] = [
    'id',
    'title',
    'min_stock',
    'max_stock',
    'total_quantity',
    'weight',
    'created_at',
];

const columns = [
    columnHelper.accessor('title', {
        header: 'Product',
        enableSorting: true,
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <span>{row.original.title}</span>
                <span className="text-sm text-muted-foreground">
                    {row.original.color}
                </span>
            </div>
        ),
    }),
    columnHelper.accessor('min_stock', {
        header: 'Min stock',
        enableSorting: true,
    }),
    columnHelper.accessor('max_stock', {
        header: 'Max stock',
        enableSorting: true,
    }),
    columnHelper.accessor('total_quantity', {
        header: 'Current stock',
        enableSorting: true,
    }),
    columnHelper.accessor('weight', {
        header: 'Weight',
        enableSorting: true,
    }),
    columnHelper.accessor('created_at', {
        header: 'Created',
        enableSorting: true,
        cell: ({ getValue }) => formatDateTime(getValue() as string | null),
    }),
    columnHelper.display({
        id: 'warehouses',
        header: 'Warehouses',
        cell: ({ row }) =>
            row.original.warehouses.length ? (
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    {row.original.warehouses.map((warehouse) => (
                        <div
                            key={warehouse.id}
                            className="flex items-center justify-between gap-3"
                        >
                            <span>{warehouse.name}</span>
                            <span className="text-xs">
                                {warehouse.quantity ?? 0}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
            ),
    }),
];

const formatDateTime = (value: string | null) =>
    value ? new Date(value).toLocaleString() : '—';

const getSortingState = (value: string | null | undefined): SortingState => {
    if (!value) {
        return [{ id: 'id', desc: false }];
    }
    const desc = value.startsWith('-');
    const id = (desc ? value.slice(1) : value) as InventoryColumnKey;
    return sortableColumns.includes(id)
        ? [{ id, desc }]
        : [{ id: 'id', desc: false }];
};

const getSortParam = (sorting?: SortingState[number]) =>
    sorting ? (sorting.desc ? `-${sorting.id}` : sorting.id) : undefined;

type InventoryTableProps = Readonly<{
    products: PaginatedProducts;
    sort: string;
    filters: InventoryFilters;
    filterableWarehouses: App.Data.WarehouseData[];
}>;

export default function InventoryTable({
    products,
    sort,
    filters,
    filterableWarehouses,
}: InventoryTableProps) {
    const sorting = getSortingState(sort);
    const [filterValues, setFilterValues] = useState<InventoryFilters>({
        id: filters.id ?? '',
        title: filters.title ?? '',
        color: filters.color ?? '',
        min_stock: filters.min_stock ?? '',
        max_stock: filters.max_stock ?? '',
        total_quantity: filters.total_quantity ?? '',
        weight: filters.weight ?? '',
        warehouses: Array.isArray(filters.warehouses)
            ? filters.warehouses
            : filters.warehouses
                ? String(filters.warehouses).split(',').filter(Boolean)
                : [],
        below_minimum: filters.below_minimum ?? '',
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const routerOptions = {
        preserveScroll: true,
        preserveState: true,
        replace: true,
    };
    const stockFilter = filterValues.below_minimum ? 'belowMin' : 'all';

    function buildFilters(source: InventoryFilters) {
        return Object.fromEntries(
            Object.entries(source).flatMap(([key, value]) => {
                if (Array.isArray(value)) {
                    return value.length > 0
                        ? [[key, value.join(',')]]
                        : [];
                }

                if (
                    value !== undefined &&
                    value !== null &&
                    value !== '' &&
                    value !== 'any'
                ) {
                    return [[key, value]];
                }

                return [];
            }),
        );
    }

    const submitFilters = () => {
        const activeFilters = buildFilters(filterValues);
        router.get(
            inventoryIndex({
                query: {
                    page: 1,
                    sort: getSortParam(sorting[0]),
                    ...(Object.keys(activeFilters).length
                        ? { filter: activeFilters }
                        : {}),
                },
            }).url,
            {},
            routerOptions,
        );
        setIsFilterOpen(false);
    };

    const updateStockFilter = (next: 'all' | 'belowMin') => {
        const nextFilters = {
            ...filterValues,
            below_minimum: next === 'belowMin' ? '1' : '',
        };
        setFilterValues(nextFilters);
        const activeFilters = buildFilters({
            ...filters,
            below_minimum: nextFilters.below_minimum,
        });
        router.get(
            inventoryIndex({
                query: {
                    page: 1,
                    sort: getSortParam(sorting[0]),
                    ...(Object.keys(activeFilters).length
                        ? { filter: activeFilters }
                        : {}),
                },
            }).url,
            {},
            routerOptions,
        );
    };

    const navigate = (page: number, nextSorting?: SortingState[number]) => {
        const activeFilters = buildFilters({
            ...filters,
            below_minimum: filterValues.below_minimum,
        });
        router.get(
            inventoryIndex({
                query: {
                    page,
                    sort: getSortParam(nextSorting ?? sorting[0]),
                    ...(Object.keys(activeFilters).length
                        ? { filter: activeFilters }
                        : {}),
                },
            }).url,
            {},
            routerOptions,
        );
    };

    const table = useReactTable({
        data: products.data,
        columns,
        state: { sorting },
        manualSorting: true,
        enableSortingRemoval: false,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: (updater) => {
            const next = typeof updater === 'function' ? updater(sorting) : updater;
            const [nextSorting] = next;
            navigate(1, nextSorting);
        },
    });

    useEventListener('keydown', (event) => {
        if (!isFilterOpen) {
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            submitFilters();
        }
    });

    const hasPrevious = products.current_page > 1;
    const hasNext = products.current_page < products.last_page;

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-3 px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant={stockFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            type="button"
                            onClick={() => updateStockFilter('all')}
                            aria-pressed={stockFilter === 'all'}
                        >
                            Show all
                        </Button>
                        <Button
                            variant={stockFilter === 'belowMin' ? 'default' : 'outline'}
                            size="sm"
                            type="button"
                            onClick={() => updateStockFilter('belowMin')}
                            aria-pressed={stockFilter === 'belowMin'}
                        >
                            Below minimum
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-base font-semibold text-foreground">
                            Inventory
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                            {products.total}
                        </span>
                    </div>
                </div>
                <InventoryFilterSheet
                    open={isFilterOpen}
                    onOpenChange={setIsFilterOpen}
                    filters={filterValues}
                    onChange={setFilterValues}
                    onApply={submitFilters}
                    warehouses={filterableWarehouses}
                />
            </div>
            <div className="overflow-hidden border-t border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {table.getFlatHeaders().map((header) => {
                                const sorted = header.column.getIsSorted();
                                return (
                                    <TableHead key={header.id}>
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {sorted === 'asc' && (
                                                <span className="text-xs">↑</span>
                                            )}
                                            {sorted === 'desc' && (
                                                <span className="text-xs">↓</span>
                                            )}
                                        </button>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="cursor-pointer"
                                onClick={() =>
                                    router.visit(editProduct(row.original.id).url, {
                                        preserveScroll: true,
                                        preserveState: true,
                                    })
                                }
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {products.data.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border bg-background px-6 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(products.current_page - 1)}
                    disabled={!hasPrevious || !products.data.length}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(products.current_page + 1)}
                    disabled={!hasNext || !products.data.length}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

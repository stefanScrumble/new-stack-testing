import InventoryTable, {
    type PaginatedProducts,
} from '@/components/inventory/inventory-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import inventoryRoutes from '@/routes/inventory';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: inventoryRoutes.index().url,
    },
];

type InventoryIndexProps = Readonly<{
    products: PaginatedProducts;
    sort: string;
    filters: import('@/components/inventory/inventory-table').InventoryFilters;
    filterableWarehouses: App.Data.WarehouseData[];
}>;

export default function InventoryIndex({
    products,
    sort,
    filters,
    filterableWarehouses,
}: InventoryIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href={inventoryRoutes.create().url}>Add product</Link>
                    </Button>
                </div>
                <InventoryTable
                    products={products}
                    sort={sort}
                    filters={filters}
                    filterableWarehouses={filterableWarehouses}
                />
            </div>
        </AppLayout>
    );
}

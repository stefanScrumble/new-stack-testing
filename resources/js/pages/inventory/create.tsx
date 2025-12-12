import { InventoryForm } from '@/components/inventory/inventory-form';
import AppLayout from '@/layouts/app-layout';
import { store } from '@/actions/App/Http/Controllers/ProductController';
import inventoryRoutes from '@/routes/inventory';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

type CreateInventoryPageProps = Readonly<{
    warehouses: App.Data.WarehouseData[];
}>;

export default function CreateInventoryPage({
    warehouses,
}: CreateInventoryPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inventory', href: inventoryRoutes.index().url },
        { title: 'Add product', href: inventoryRoutes.create().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add product" />
            <InventoryForm
                warehouses={warehouses}
                submitAction={store()}
                submitLabel="Create product"
                cancelHref={inventoryRoutes.index().url}
            />
        </AppLayout>
    );
}

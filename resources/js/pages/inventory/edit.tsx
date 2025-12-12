import { InventoryForm } from '@/components/inventory/inventory-form';
import AppLayout from '@/layouts/app-layout';
import { update } from '@/actions/App/Http/Controllers/ProductController';
import inventoryRoutes from '@/routes/inventory';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

type EditInventoryPageProps = Readonly<{
    product: App.Data.ProductData;
    warehouses: App.Data.WarehouseData[];
}>;

export default function EditInventoryPage({
    product,
    warehouses,
}: EditInventoryPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inventory', href: inventoryRoutes.index().url },
        { title: `Edit ${product.title}`, href: inventoryRoutes.edit(product.id).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${product.title}`} />
            <InventoryForm
                product={product}
                warehouses={warehouses}
                submitAction={update(product.id)}
                submitLabel="Save product"
                cancelHref={inventoryRoutes.index().url}
            />
        </AppLayout>
    );
}

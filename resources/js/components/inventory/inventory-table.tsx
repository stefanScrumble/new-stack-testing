import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { resolveUrl } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { edit as editProduct, index as inventoryIndex } from '@/actions/App/Http/Controllers/ProductController';

export type InventoryProduct = App.Data.ProductData;

type PaginationLink = { url: string | null; label: string; active: boolean };

export type PaginatedProducts = {
    data: InventoryProduct[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type InventoryTableProps = Readonly<{
    products: PaginatedProducts;
}>;

export default function InventoryTable({ products }: InventoryTableProps) {
    const navigate = (page: number) =>
        router.get(
            resolveUrl(inventoryIndex({ query: { page } })),
            {},
            { preserveScroll: true, preserveState: true, replace: true },
        );

    const hasPrevious = products.current_page > 1;
    const hasNext = products.current_page < products.last_page;

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-3 px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-base font-semibold text-foreground">
                        Inventory
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {products.total}
                    </span>
                </div>
            </div>
            <div className="overflow-hidden border-t border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Stock range</TableHead>
                            <TableHead>Total quantity</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>Dimensions</TableHead>
                            <TableHead>Warehouses</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.data.map((product) => (
                            <TableRow
                                key={product.id}
                                className="cursor-pointer"
                                onClick={() =>
                                    router.visit(editProduct(product.id).url, {
                                        preserveScroll: true,
                                        preserveState: true,
                                    })
                                }
                            >
                                <TableCell className="font-medium">
                                    <div className="flex flex-col gap-1">
                                        <span>{product.title}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {product.color}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-muted-foreground">
                                        {product.min_stock} - {product.max_stock}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-foreground">
                                        {product.total_quantity}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-muted-foreground">
                                        {product.weight}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-muted-foreground">
                                        {product.dimensions}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {product.warehouses.length ? (
                                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                            {product.warehouses.map((warehouse) => (
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
                                        <span className="text-sm text-muted-foreground">
                                            Unassigned
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {products.data.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
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

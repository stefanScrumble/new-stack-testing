declare namespace App.Data {
export type ProductData = {
id: number;
title: string;
min_stock: number;
max_stock: number;
weight: number;
dimensions: string;
color: string;
total_quantity: number;
warehouses: any;
created_at: string | null;
};
export type UserData = {
id: number;
name: string;
email: string;
email_verified_at: string | null;
created_at: string | null;
updated_at: string | null;
posts_count: number | null;
comments_count: number | null;
};
export type WarehouseData = {
id: number;
name: string;
quantity: number | null;
};
}

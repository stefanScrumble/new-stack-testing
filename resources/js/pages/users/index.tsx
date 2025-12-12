import UsersTable, { type UsersTableUser } from '@/components/users/users-table';
import AppLayout from '@/layouts/app-layout';
import { users as usersRoute } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: usersRoute().url,
    },
];

export default function UsersIndex({ users }: { users: UsersTableUser[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex flex-1 flex-col gap-4">
                <UsersTable users={users} />
            </div>
        </AppLayout>
    );
}

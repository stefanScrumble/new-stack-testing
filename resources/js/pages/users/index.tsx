import UsersTable, {
    type PaginatedUsers,
    type UserFilters,
} from '@/components/users/users-table';
import AppLayout from '@/layouts/app-layout';
import { users as usersRoute } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: usersRoute().url,
    },
];

export default function UsersIndex({
    users,
    sort,
    filters,
}: {
    users: PaginatedUsers;
    sort: string;
    filters: UserFilters;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-foreground">
                        Users
                    </h1>
                    <Button asChild>
                        <Link href="/users/create">Create user</Link>
                    </Button>
                </div>
                <UsersTable users={users} sort={sort} filters={filters} />
            </div>
        </AppLayout>
    );
}

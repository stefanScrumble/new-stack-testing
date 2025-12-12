import { Table, TableCard } from '@/components/application/table/table';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { type SortDescriptor } from 'react-aria-components';

export type UsersTableUser = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
};

type UserColumnKey = keyof UsersTableUser;

const columns: { id: UserColumnKey; label: string; sortable?: boolean }[] = [
    { id: 'id', label: 'ID', sortable: true },
    { id: 'name', label: 'Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'email_verified_at', label: 'Verified', sortable: true },
    { id: 'created_at', label: 'Created', sortable: true },
];

const pageSize = 10;

const formatDateTime = (value: string | null) =>
    value ? new Date(value).toLocaleString() : '—';

const getSortableValue = (user: UsersTableUser, key: UserColumnKey) => {
    if (key === 'id') {
        return user.id;
    }

    if (key === 'created_at' || key === 'email_verified_at') {
        return user[key] ? new Date(user[key] as string).getTime() : 0;
    }

    return typeof user[key] === 'string'
        ? (user[key] as string).toLowerCase()
        : user[key] ?? '';
};

const renderCell = (user: UsersTableUser, key: UserColumnKey) => {
    if (key === 'created_at' || key === 'email_verified_at') {
        return formatDateTime(user[key] as string | null);
    }

    return user[key];
};

export default function UsersTable({ users }: { users: UsersTableUser[] }) {
    const [page, setPage] = useState(0);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: 'id',
        direction: 'ascending',
    });

    const sortedUsers = useMemo(() => {
        const { column, direction } = sortDescriptor;
        if (!column || !direction) {
            return [...users];
        }

        const key = column as UserColumnKey;
        const directionMultiplier = direction === 'ascending' ? 1 : -1;

        return [...users].sort((first, second) => {
            const firstValue = getSortableValue(first, key);
            const secondValue = getSortableValue(second, key);

            if (firstValue === secondValue) {
                return 0;
            }

            return firstValue > secondValue
                ? directionMultiplier
                : -directionMultiplier;
        });
    }, [sortDescriptor, users]);

    const pageCount = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
    const currentPage = Math.min(page, pageCount - 1);
    const start = currentPage * pageSize;
    const paginatedUsers = sortedUsers.slice(start, start + pageSize);

    return (
        <TableCard.Root>
            <TableCard.Header title="Users" badge={users.length} />

            <Table
                aria-label="Users table"
                sortDescriptor={sortDescriptor}
                onSortChange={(descriptor) => {
                    setPage(0);
                    setSortDescriptor(descriptor);
                }}
                selectionMode="none"
            >
                <Table.Header columns={columns}>
                    {(column) => (
                        <Table.Head
                            id={column.id}
                            allowsSorting={column.sortable}
                        >
                            {column.label}
                        </Table.Head>
                    )}
                </Table.Header>
                <Table.Body
                    items={paginatedUsers}
                    renderEmptyState={() => (
                        <div className="px-6 py-8 text-sm text-tertiary">
                            No users found.
                        </div>
                    )}
                >
                    {(user) => (
                        <Table.Row id={user.id.toString()} columns={columns}>
                            {(column) => (
                                <Table.Cell>
                                    {renderCell(user, column.id)}
                                </Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

            <div className="flex items-center justify-end gap-2 border-t border-border bg-background px-6 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((value) => Math.max(value - 1, 0))}
                    disabled={currentPage === 0 || !sortedUsers.length}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setPage((value) => Math.min(value + 1, pageCount - 1))
                    }
                    disabled={currentPage >= pageCount - 1 || !sortedUsers.length}
                >
                    Next
                </Button>
            </div>
        </TableCard.Root>
    );
}

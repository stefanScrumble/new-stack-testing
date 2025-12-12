import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type SortingState,
} from '@tanstack/react-table';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEventListener } from '@/hooks/use-event-listener';
import { users as usersRoute } from '@/routes';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UsersFilterSheet } from './users-table-filters';

export type UsersTableUser = App.Data.UserData;

type UserColumnKey =
    | 'id'
    | 'name'
    | 'email'
    | 'email_verified_at'
    | 'created_at'
    | 'posts_count'
    | 'comments_count';
type PaginationLink = { url: string | null; label: string; active: boolean };
export type UserFilters = Partial<Record<UserColumnKey, string>>;

export type PaginatedUsers = {
    data: UsersTableUser[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

const columnHelper = createColumnHelper<UsersTableUser>();
const sortableColumns: UserColumnKey[] = [
    'id',
    'name',
    'email',
    'email_verified_at',
    'created_at',
    'posts_count',
    'comments_count',
];
const columns = [
    columnHelper.accessor('id', { header: 'ID', enableSorting: true }),
    columnHelper.accessor('name', { header: 'Name', enableSorting: true }),
    columnHelper.accessor('email', { header: 'Email', enableSorting: true }),
    columnHelper.accessor('email_verified_at', {
        header: 'Verified',
        enableSorting: true,
        cell: ({ getValue }) => formatDateTime(getValue() as string | null),
    }),
    columnHelper.accessor('created_at', {
        header: 'Created',
        enableSorting: true,
        cell: ({ getValue }) => formatDateTime(getValue() as string | null),
    }),
    columnHelper.accessor('posts_count', { header: 'Posts', enableSorting: true }),
    columnHelper.accessor('comments_count', {
        header: 'Comments',
        enableSorting: true,
    }),
];

const formatDateTime = (value: string | null) =>
    value ? new Date(value).toLocaleString() : '—';

const getSortingState = (value: string | null | undefined): SortingState => {
    if (!value) {
        return [{ id: 'id', desc: false }];
    }
    const desc = value.startsWith('-');
    const id = (desc ? value.slice(1) : value) as UserColumnKey;
    return sortableColumns.includes(id)
        ? [{ id, desc }]
        : [{ id: 'id', desc: false }];
};

const getSortParam = (sorting?: SortingState[number]) =>
    sorting ? (sorting.desc ? `-${sorting.id}` : sorting.id) : undefined;

type UsersTableProps = Readonly<{
    users: PaginatedUsers;
    sort: string;
    filters: UserFilters;
}>;

export default function UsersTable({
    users,
    sort,
    filters,
}: UsersTableProps) {
    const sorting = getSortingState(sort);
    const [filterValues, setFilterValues] = useState<UserFilters>({
        id: filters.id ?? '',
        name: filters.name ?? '',
        email: filters.email ?? '',
        email_verified_at: filters.email_verified_at ?? '',
        created_at: filters.created_at ?? '',
        posts_count: filters.posts_count ?? '',
        comments_count: filters.comments_count ?? '',
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const routerOptions = {
        preserveScroll: true,
        preserveState: true,
        replace: true,
    };

    function buildFilters(source: UserFilters) {
        return Object.fromEntries(
            Object.entries(source).filter(
                ([, value]) =>
                    value !== undefined &&
                    value !== null &&
                    value !== '' &&
                    value !== 'any',
            ),
        );
    }

    const submitFilters = () => {
        const activeFilters = buildFilters(filterValues);
        router.get(
            usersRoute({
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

    const navigate = (page: number, nextSorting?: SortingState[number]) => {
        const activeFilters = buildFilters(filters);
        router.get(
            usersRoute({
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
        data: users.data,
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

    const hasPrevious = users.current_page > 1;
    const hasNext = users.current_page < users.last_page;

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-base font-semibold text-foreground">
                        Users
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {users.total}
                    </span>
                </div>
                <UsersFilterSheet
                    open={isFilterOpen}
                    onOpenChange={setIsFilterOpen}
                    filters={filterValues}
                    onChange={setFilterValues}
                    onApply={submitFilters}
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
                                    router.visit(`/users/${row.original.id}/edit`, {
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
                        {users.data.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    No users found.
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
                    onClick={() => navigate(users.current_page - 1)}
                    disabled={!hasPrevious || !users.data.length}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(users.current_page + 1)}
                    disabled={!hasNext || !users.data.length}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

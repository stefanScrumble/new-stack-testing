import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useEventListener } from '@/hooks/use-event-listener';
import { users as usersRoute } from '@/routes';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { type SortDescriptor } from 'react-aria-components';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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

const columns: { id: UserColumnKey; label: string; sortable?: boolean }[] = [
    { id: 'id', label: 'ID', sortable: true },
    { id: 'name', label: 'Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'email_verified_at', label: 'Verified', sortable: true },
    { id: 'created_at', label: 'Created', sortable: true },
    { id: 'posts_count', label: 'Posts', sortable: true },
    { id: 'comments_count', label: 'Comments', sortable: true },
];

const formatDateTime = (value: string | null) =>
    value ? new Date(value).toLocaleString() : '—';

const getSortDescriptor = (
    value: string | null | undefined,
): SortDescriptor => {
    if (!value) {
        return { column: 'id', direction: 'ascending' };
    }

    const direction = value.startsWith('-') ? 'descending' : 'ascending';
    const column = (
        direction === 'descending' ? value.slice(1) : value
    ) as UserColumnKey;

    return columns.some(({ id }) => id === column)
        ? { column, direction }
        : { column: 'id', direction: 'ascending' };
};

const getSortParam = (descriptor: SortDescriptor) => {
    if (!descriptor.column || !descriptor.direction) {
        return undefined;
    }

    const column = descriptor.column.toString();
    return descriptor.direction === 'descending' ? `-${column}` : column;
};

const renderCell = (user: UsersTableUser, key: UserColumnKey) => {
    if (key === 'created_at' || key === 'email_verified_at') {
        return formatDateTime(user[key] as string | null);
    }

    return user[key];
};

export default function UsersTable({
    users,
    sort,
    filters,
}: {
    users: PaginatedUsers;
    sort: string;
    filters: UserFilters;
}) {
    const sortDescriptor = getSortDescriptor(sort);
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

    useEffect(() => {
        setFilterValues({
            id: filters.id ?? '',
            name: filters.name ?? '',
            email: filters.email ?? '',
            email_verified_at: filters.email_verified_at ?? '',
            created_at: filters.created_at ?? '',
            posts_count: filters.posts_count ?? '',
            comments_count: filters.comments_count ?? '',
        });
    }, [filters]);

    const submitFilters = () => {
        const activeFilters = buildFilters(filterValues);
        const query: Record<string, unknown> = {
            page: 1,
            sort: getSortParam(sortDescriptor),
        };

        if (Object.keys(activeFilters).length) {
            query.filter = activeFilters;
        }

        router.get(
            usersRoute({ query }).url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
        setIsFilterOpen(false);
    };

    useEventListener('keydown', (event) => {
        if (!isFilterOpen) {
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            submitFilters();
        }
    });

    const buildFilters = (source: UserFilters) =>
        Object.fromEntries(
            Object.entries(source).filter(
                ([, value]) =>
                    value !== undefined &&
                    value !== null &&
                    value !== '' &&
                    value !== 'any',
            ),
        );

    const navigate = (page: number, descriptor?: SortDescriptor) => {
        const activeFilters = buildFilters(filters);
        router.get(
            usersRoute({
                query: {
                    page,
                    sort: getSortParam(descriptor ?? sortDescriptor),
                    ...(Object.keys(activeFilters).length
                        ? { filter: activeFilters }
                        : {}),
                },
            }).url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const verificationStatus =
        filterValues.email_verified_at === 'verified' ||
        filterValues.email_verified_at === 'unverified'
            ? filterValues.email_verified_at
            : 'any';

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
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="max-w-md">
                        <SheetHeader>
                            <SheetTitle>Filter users</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
                            <div className="grid grid-cols-1 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-sm font-medium text-foreground"
                                            htmlFor="filter-id"
                                        >
                                            ID
                                        </label>
                                        <Input
                                            id="filter-id"
                                            type="number"
                                            value={filterValues.id ?? ''}
                                            onChange={(event) =>
                                                setFilterValues({
                                                    ...filterValues,
                                                    id: event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-sm font-medium text-foreground"
                                            htmlFor="filter-name"
                                        >
                                            Name
                                        </label>
                                        <Input
                                            id="filter-name"
                                            value={filterValues.name ?? ''}
                                            onChange={(event) =>
                                                setFilterValues({
                                                    ...filterValues,
                                                    name: event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-sm font-medium text-foreground"
                                            htmlFor="filter-email"
                                        >
                                            Email
                                        </label>
                                        <Input
                                            id="filter-email"
                                            type="email"
                                            value={filterValues.email ?? ''}
                                            onChange={(event) =>
                                                setFilterValues({
                                                    ...filterValues,
                                                    email: event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-foreground">
                                            Verified
                                        </label>
                                        <Select
                                            value={verificationStatus}
                                            onValueChange={(value) =>
                                                setFilterValues({
                                                    ...filterValues,
                                                    email_verified_at:
                                                        value === 'any'
                                                            ? ''
                                                            : value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Any status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="any">
                                                    Any status
                                                </SelectItem>
                                                <SelectItem value="verified">
                                                    Verified
                                                </SelectItem>
                                                <SelectItem value="unverified">
                                                    Unverified
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type="date"
                                            value={
                                                verificationStatus === 'any'
                                                    ? (filterValues.email_verified_at ??
                                                      '')
                                                    : ''
                                            }
                                            onChange={(event) =>
                                                setFilterValues({
                                                    ...filterValues,
                                                    email_verified_at:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-sm font-medium text-foreground"
                                            htmlFor="filter-created-at"
                                        >
                                            Created on
                                        </label>
                                        <Input
                                            id="filter-created-at"
                                            type="date"
                                            value={
                                                filterValues.created_at ?? ''
                                            }
                                            onChange={(event) =>
                                                setFilterValues({
                                                    ...filterValues,
                                                    created_at:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-sm font-medium text-foreground"
                                            htmlFor="filter-posts"
                                        >
                                            Posts
                                        </label>
                                        <Input
                                            id="filter-posts"
                                            type="number"
                                            value={
                                                filterValues.posts_count ?? ''
                                            }
                                            onChange={(event) =>
                                                setFilterValues({
                                                    ...filterValues,
                                                    posts_count:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-sm font-medium text-foreground"
                                            htmlFor="filter-comments"
                                        >
                                            Comments
                                        </label>
                                        <Input
                                            id="filter-comments"
                                            type="number"
                                            value={
                                                filterValues.comments_count ??
                                                ''
                                            }
                                            onChange={(event) =>
                                                setFilterValues({
                                                    ...filterValues,
                                                    comments_count:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                            </div>
                        </div>
                        <SheetFooter>
                            <Button onClick={submitFilters}>Apply filters</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="overflow-hidden border-t border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => {
                                const active =
                                    sortDescriptor.column === column.id;
                                const direction =
                                    active && sortDescriptor.direction === 'ascending'
                                        ? '↑'
                                        : active
                                            ? '↓'
                                            : null;
                                return (
                                    <TableHead key={column.id}>
                                        {column.sortable ? (
                                            <button
                                                type="button"
                                                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                                                onClick={() =>
                                                    navigate(1, {
                                                        column: column.id,
                                                        direction:
                                                            sortDescriptor.column ===
                                                                column.id &&
                                                            sortDescriptor.direction ===
                                                                'ascending'
                                                                ? 'descending'
                                                                : 'ascending',
                                                    })
                                                }
                                            >
                                                {column.label}
                                                {direction && (
                                                    <span className="text-xs">
                                                        {direction}
                                                    </span>
                                                )}
                                            </button>
                                        ) : (
                                            column.label
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.length ? (
                            users.data.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="cursor-pointer"
                                    onClick={() =>
                                        router.visit(`/users/${user.id}/edit`, {
                                            preserveScroll: true,
                                            preserveState: true,
                                        })
                                    }
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>
                                            {renderCell(user, column.id)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
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

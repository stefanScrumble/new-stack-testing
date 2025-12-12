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

type UserFilters = Partial<{
    id: string;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    posts_count: string;
    comments_count: string;
}>;

type UsersFilterSheetProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    filters: UserFilters;
    onChange: (filters: UserFilters) => void;
    onApply: () => void;
};

export function UsersFilterSheet({
    open,
    onOpenChange,
    filters,
    onChange,
    onApply,
}: UsersFilterSheetProps) {
    const verificationStatus =
        filters.email_verified_at === 'verified' ||
        filters.email_verified_at === 'unverified'
            ? filters.email_verified_at
            : 'any';

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                                value={filters.id ?? ''}
                                onChange={(event) =>
                                    onChange({
                                        ...filters,
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
                                value={filters.name ?? ''}
                                onChange={(event) =>
                                    onChange({
                                        ...filters,
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
                                value={filters.email ?? ''}
                                onChange={(event) =>
                                    onChange({
                                        ...filters,
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
                                    onChange({
                                        ...filters,
                                        email_verified_at:
                                            value === 'any' ? '' : value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Any status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any status</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="unverified">
                                        Unverified
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type="date"
                                value={
                                    verificationStatus === 'any'
                                        ? filters.email_verified_at ?? ''
                                        : ''
                                }
                                onChange={(event) =>
                                    onChange({
                                        ...filters,
                                        email_verified_at: event.target.value,
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
                                value={filters.created_at ?? ''}
                                onChange={(event) =>
                                    onChange({
                                        ...filters,
                                        created_at: event.target.value,
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
                                value={filters.posts_count ?? ''}
                                onChange={(event) =>
                                    onChange({
                                        ...filters,
                                        posts_count: event.target.value,
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
                                value={filters.comments_count ?? ''}
                                onChange={(event) =>
                                    onChange({
                                        ...filters,
                                        comments_count: event.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <Button onClick={onApply}>Apply filters</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

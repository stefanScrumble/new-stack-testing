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
import type { UserFilters } from './users-table';

type UsersFilterSheetProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    filters: UserFilters;
    onChange: (filters: UserFilters) => void;
    onApply: () => void;
};

const filterFields: {
    key: keyof UserFilters;
    label: string;
    type?: 'text' | 'number' | 'email' | 'date';
}[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'created_at', label: 'Created on', type: 'date' },
    { key: 'posts_count', label: 'Posts', type: 'number' },
    { key: 'comments_count', label: 'Comments', type: 'number' },
];

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

    const updateFilter = (key: keyof UserFilters, value: string) =>
        onChange({ ...filters, [key]: value });

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
                        {filterFields.map(({ key, label, type }) => (
                            <div key={key} className="flex flex-col gap-2">
                                <label
                                    className="text-sm font-medium text-foreground"
                                    htmlFor={`filter-${key}`}
                                >
                                    {label}
                                </label>
                                <Input
                                    id={`filter-${key}`}
                                    type={type ?? 'text'}
                                    value={filters[key] ?? ''}
                                    onChange={(event) =>
                                        updateFilter(key, event.target.value)
                                    }
                                />
                            </div>
                        ))}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground">
                                Verified
                            </label>
                            <Select
                                value={verificationStatus}
                                onValueChange={(value) =>
                                    updateFilter(
                                        'email_verified_at',
                                        value === 'any' ? '' : value,
                                    )
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
                                    updateFilter('email_verified_at', event.target.value)
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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Option = {
    label: string;
    value: string;
};

type MultiSelectProps = {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
};

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = 'Select options',
}: MultiSelectProps) {
    const toggleValue = (optionValue: string) => {
        const exists = value.includes(optionValue);
        const next = exists
            ? value.filter((item) => item !== optionValue)
            : [...value, optionValue];
        onChange(next);
    };

    const selectedLabels = options
        .filter((option) => value.includes(option.value))
        .map((option) => option.label);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex w-full items-center justify-between"
                >
                    <span className="flex flex-wrap gap-1">
                        {selectedLabels.length === 0 && (
                            <span className="text-muted-foreground text-sm">
                                {placeholder}
                            </span>
                        )}
                        {selectedLabels.map((label) => (
                            <Badge key={label} variant="secondary">
                                {label}
                            </Badge>
                        ))}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
                {options.map((option) => (
                    <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={value.includes(option.value)}
                        onCheckedChange={() => toggleValue(option.value)}
                    >
                        {option.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FormControl } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

export type ComboboxOptions = {
  value: string;
  label: string;
  type?: 'inherit' | 'manual';
};

type ComboboxProps = React.ComponentProps<'input'> & {
  value?: string | string[];
  multiple?: boolean;
  options?: string[];
  allowCreate?: boolean;
  onChange?: (value: string | string[]) => void;
};

function Combobox({
  multiple = false,
  allowCreate = false,
  className,
  options = [],
  placeholder,
  value,
  onChange,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>('');
  const [cOptions, setCOptions] = React.useState<ComboboxOptions[]>([]);
  React.useEffect(() => {
    const formattedOptions = options.map((option) => ({
      value: option,
      label: option,
      type: 'inherit' as const,
    }));
    setCOptions(formattedOptions);
  }, [options]);
  /*   React.useEffect(() => {
    if (value && !Array.isArray(value)) {
      setCOptions((prev) =>
        prev.map((item) =>
          item.value === value ? { ...item, type: 'inherit' } : item,
        ),
      );
    } else if (Array.isArray(value)) {
      setCOptions((prev) =>
        prev.map((item) =>
          value.includes(item.value) ? { ...item, type: 'inherit' } : item,
        ),
      );
    }
  }, [value]); */
  const createItem = (query: string) => {
    setCOptions((prev) => [
      ...prev,
      { value: query, label: query, type: 'manual' },
    ]);
    if (onChange) {
      if (multiple && Array.isArray(value)) {
        onChange([...value, query]);
      } else {
        onChange(query);
      }
    }
    setOpen(false);
    setQuery('');
  };
  return (
    <div className={cn('block w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-auto"
            >
              <div className="overflow-hidden">
                {value && value.length > 0 ? (
                  <div className="relative mr-auto flex flex-grow flex-wrap items-center overflow-hidden gap-2">
                    {multiple && Array.isArray(value)
                      ? value.map((selectedValue: string) => (
                          <Badge
                            key={selectedValue}
                            variant={
                              cOptions.find(
                                (item) => item.value === selectedValue,
                              )?.type === 'manual'
                                ? 'destructive'
                                : 'default'
                            }
                          >
                            {
                              cOptions.find(
                                (item) => item.value === selectedValue,
                              )?.label
                            }
                            <div
                              role="button"
                              className="ml-1 cursor-pointer hover:text-red-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onChange) {
                                  onChange(
                                    value.filter(
                                      (item) => item !== selectedValue,
                                    ),
                                  );
                                }
                              }}
                            >
                              &times;
                            </div>
                          </Badge>
                        ))
                      : !multiple &&
                        cOptions.find((item) => item.value === value)?.label}
                  </div>
                ) : (
                  (placeholder ?? '')
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-72 max-w-sm p-0">
          <Command>
            <CommandInput
              {...props}
              placeholder={placeholder ?? 'Search...'}
              onValueChange={(value: string) => setQuery(value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter' && allowCreate && query)
                  createItem(query);
                if (e.key === 'Escape') {
                  setOpen(false);
                  setQuery('');
                }
              }}
            />
            {allowCreate && query ? (
              <CommandEmpty
                onClick={() => createItem(query)}
                className="flex cursor-pointer items-baseline justify-center gap-1 py-2 hover:bg-secondary"
              >
                <small className="opacity-50">Create: </small>
                <p className="block max-w-48 truncate text-primary">{query}</p>
              </CommandEmpty>
            ) : (
              <CommandEmpty>
                <small className="opacity-50">No results found</small>
              </CommandEmpty>
            )}
            <ScrollArea>
              <div className="max-h-80">
                <CommandList>
                  <CommandGroup>
                    {cOptions.map((option) => (
                      <CommandItem
                        key={option.label}
                        value={option.label}
                        onSelect={() => {
                          if (onChange) {
                            if (multiple && Array.isArray(value)) {
                              onChange(
                                value.includes(option.value)
                                  ? value.filter(
                                      (item) => item !== option.value,
                                    )
                                  : [...value, option.value],
                              );
                            } else {
                              onChange(option.value);
                              setOpen(false);
                            }
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            (multiple &&
                              Array.isArray(value) &&
                              value.includes(option.value)) ||
                              option.value === value
                              ? //
                                'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        <div className="flex space-x-2">
                          <span className="max-w-[400px] truncate font-medium">
                            {option.label}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </div>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { Combobox };

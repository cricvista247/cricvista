// components/AutoSearchField.tsx
"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

interface AutoSearchFieldProps {
  label?: string;
  fetchOptions: (query: string) => Promise<Option[]>;
  placeholder?: string;
  onSelect: (option: Option) => void;
  className?: string;
}

export default function AutoSearchField({
  label,
  fetchOptions,
  placeholder = "Search...",
  onSelect,
  className = "",
}: AutoSearchFieldProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [options, setOptions] = useState<Option[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      fetchOptions(debouncedQuery)
        .then(setOptions)
        .finally(() => setLoading(false));
    } else {
      setOptions([]);
    }
  }, [debouncedQuery, fetchOptions]);

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      {label && (
        <label className="block mb-1 text-sm font-medium">{label}</label>
      )}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <input
            type="text"
            placeholder={placeholder}
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 ring-blue-500"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={5}
            className="z-50 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-auto"
          >
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
            ) : options.length > 0 ? (
              options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onSelect(opt);
                    setQuery(opt.label);
                    setOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No results found
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

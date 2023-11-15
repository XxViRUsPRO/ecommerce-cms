"use client";

import React, { useState } from "react";

import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Store } from "@prisma/client";
import { useStoreModal } from "@/hooks/use-store-modal";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSelectorProps extends PopoverTriggerProps {
  items: Store[];
}

type StoreItem = {
  label: string;
  value: string;
};

export default function StoreSelector({
  className,
  items = [],
}: StoreSelectorProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const stores: StoreItem[] = items.map((store) => ({
    label: store.name,
    value: store.id,
  }));

  const currentStore: StoreItem | undefined = stores.find(
    (store) => store.value === params.storeId
  );

  const [open, setOpen] = useState(false);

  const onSelect = (store: StoreItem) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          className={cn("w-52 justify-between", className)}
          aria-expanded={open}
          aria-label="Select a store"
        >
          <StoreIcon className="mr-2 w-4 h-4" />
          <span>{currentStore?.label}</span>
          <ChevronsUpDown className="ml-auto w-4 h-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search stores" />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {stores.map((store) => (
                <CommandItem
                  key={store.value}
                  value={store.value}
                  onSelect={() => onSelect(store)}
                >
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto w-4 h-4 shrink-0",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.open();
                }}
              >
                <PlusCircle className="mr-2 w-4 h-4" />
                <span>Create a new store</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { ComponentProps, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ComboboxProps = {
	readonly options: { value: string; label: string }[];
	readonly onChange: (newValue: string) => void;
	readonly label: string;
	readonly value?: string | undefined;
	readonly valueDefault?: string;
	readonly search: string;
	readonly setSearch: (searchValue: string) => void;
	readonly disabled?: boolean;
	readonly ref?: ComponentProps<typeof Button>["ref"];
};

export const Combobox = ({
	options,
	onChange,
	label,
	value = "",
	valueDefault = "",
	search,
	setSearch,
	disabled = false,
	ref,
}: ComboboxProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open && !disabled} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					ref={ref}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="flex w-full justify-between"
					disabled={disabled}
				>
					{value
						? options.find((option) => option.value === value)?.label
						: `Select ${label}...`}
					<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder={`Search for ${label}...`}
						value={search}
						onInput={(e) => setSearch(e.currentTarget.value)}
						className="h-9"
					/>
					<CommandList>
						<CommandEmpty>No {label} found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(currentValue: string) => {
										onChange(
											currentValue === value ? valueDefault : currentValue,
										);
										setOpen(false);
									}}
								>
									{option.label}
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4",
											value === option.value ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { forwardRef, useState } from "react";

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
	options: { value: string; label: string }[];
	onChange: (newValue: string) => void;
	label: string;
	value?: string | undefined;
	search: string;
	setSearch: (searchValue: string) => void;
	disabled?: boolean;
};

export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
	(
		{
			options,
			onChange,
			label,
			value = "",
			search,
			setSearch,
			disabled = false,
		}: ComboboxProps,
		ref,
	) => {
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
											onChange(currentValue === value ? "" : currentValue);
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
	},
);
Combobox.displayName = "Combobox";

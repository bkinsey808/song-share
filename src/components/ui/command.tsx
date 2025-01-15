"use client";

import { type DialogProps } from "@radix-ui/react-dialog";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Command as CommandPrimitive } from "cmdk";
import { ComponentProps, JSX } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type CommandProps = ComponentProps<typeof CommandPrimitive>;

export const Command = ({ className, ...props }: CommandProps): JSX.Element => (
	<CommandPrimitive
		className={cn(
			"flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
			className,
		)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

type CommandDialogProps = DialogProps;

export const CommandDialog = ({
	children,
	...props
}: CommandDialogProps): JSX.Element => {
	return (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<Dialog {...props}>
			<DialogContent className="overflow-hidden p-0">
				<Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
};

type CommandInputProps = ComponentProps<typeof CommandPrimitive.Input>;

export const CommandInput = ({
	className,
	...props
}: CommandInputProps): JSX.Element => (
	// eslint-disable-next-line react/no-unknown-property
	<div className="flex items-center border-b px-3" cmdk-input-wrapper="">
		<MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
		<CommandPrimitive.Input
			className={cn(
				"flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	</div>
);

type CommandListProps = ComponentProps<typeof CommandPrimitive.List>;

export const CommandList = ({
	className,
	...props
}: CommandListProps): JSX.Element => (
	<CommandPrimitive.List
		className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

type CommandEmptyProps = ComponentProps<typeof CommandPrimitive.Empty>;

export const CommandEmpty = (props: CommandEmptyProps): JSX.Element => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<CommandPrimitive.Empty className="py-6 text-center text-sm" {...props} />
);

type CommandGroupProps = ComponentProps<typeof CommandPrimitive.Group>;

export const CommandGroup = ({
	className,
	...props
}: CommandGroupProps): JSX.Element => (
	<CommandPrimitive.Group
		className={cn(
			"overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
			className,
		)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

type CommandSeparatorProps = ComponentProps<typeof CommandPrimitive.Separator>;
export const CommandSeparator = ({
	className,
	...props
}: CommandSeparatorProps): JSX.Element => (
	<CommandPrimitive.Separator
		className={cn("-mx-1 h-px bg-border", className)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

type CommandItemProps = ComponentProps<typeof CommandPrimitive.Item>;

export const CommandItem = ({
	className,
	...props
}: CommandItemProps): JSX.Element => (
	<CommandPrimitive.Item
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
			className,
		)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

type CommandShortCutProps = ComponentProps<"span">;

export const CommandShortcut = ({
	className,
	...props
}: CommandShortCutProps): JSX.Element => {
	return (
		<span
			className={cn(
				"ml-auto text-xs tracking-widest text-muted-foreground",
				className,
			)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	);
};

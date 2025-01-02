"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { ComponentProps, JSX } from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = Omit<
	ComponentProps<typeof CheckboxPrimitive.Root>,
	"value"
> & {
	readonly value: boolean | undefined;
};

export const Checkbox = ({
	className,
	value = false,
	...props
}: CheckboxProps): JSX.Element => {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				"peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
				className,
			)}
			{...props}
			checked={value ?? false}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
			value={(value ?? false) as any}
			onClick={(e) => {
				e.stopPropagation();
				props.onClick?.(e);
			}}
		>
			<CheckboxPrimitive.Indicator
				className={cn("flex items-center justify-center text-current")}
			>
				<CheckIcon className="h-4 w-4" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
};

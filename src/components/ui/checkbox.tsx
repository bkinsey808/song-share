"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "@/lib/utils";

const CheckboxStringValue = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	Omit<
		React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
		"value"
	> & {
		value: boolean | undefined;
	}
>(({ className, value = false, ...props }, ref) => {
	const internalRef = React.useRef<HTMLInputElement>(null);
	React.useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
		ref as React.Ref<HTMLInputElement | null>,
		() => internalRef.current,
	);
	return (
		<CheckboxPrimitive.Root
			ref={ref}
			className={cn(
				"peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
				className,
			)}
			{...props}
			checked={value ?? false}
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
});
CheckboxStringValue.displayName = CheckboxPrimitive.Root.displayName;

// make a version of Checkbox such that the type of value prop is boolean
type CheckboxProps = React.ComponentProps<typeof CheckboxStringValue>;
type CheckboxBooleanProps = Omit<CheckboxProps, "value"> & {
	value: boolean | undefined;
};

const Checkbox = CheckboxStringValue as unknown as React.FC<
	CheckboxBooleanProps & {
		value: boolean | undefined;
	}
>;

export { Checkbox };

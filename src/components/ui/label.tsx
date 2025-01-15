"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { type VariantProps, cva } from "class-variance-authority";
import { ComponentProps, JSX } from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

type LabelProps = ComponentProps<typeof LabelPrimitive.Root> &
	VariantProps<typeof labelVariants>;

export const Label = ({ className, ...props }: LabelProps): JSX.Element => (
	<LabelPrimitive.Root
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
		className={cn(labelVariants(), className)}
	/>
);

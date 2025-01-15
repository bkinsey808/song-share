import { type VariantProps, cva } from "class-variance-authority";
import { JSX } from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
	"relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground",
				destructive:
					"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

type AlertProps = React.HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof alertVariants>;

export const Alert = ({
	className,
	variant,
	...props
}: AlertProps): JSX.Element => (
	<div
		role="alert"
		className={cn(alertVariants({ variant }), className)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export const AlertTitle = ({
	className,
	...props
}: AlertTitleProps): JSX.Element => (
	<h5
		className={cn("mb-1 font-medium leading-none tracking-tight", className)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const AlertDescription = ({
	className,
	...props
}: AlertDescriptionProps): JSX.Element => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
);

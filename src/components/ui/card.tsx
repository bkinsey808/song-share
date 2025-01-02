import { ComponentProps, JSX } from "react";

import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"div">;

export const Card = ({ className, ...props }: CardProps): JSX.Element => (
	<div
		className={cn(
			"rounded-xl border bg-card text-card-foreground shadow",
			className,
		)}
		{...props}
	/>
);

type CardHeaderProps = ComponentProps<"div">;

export const CardHeader = ({
	className,
	...props
}: CardHeaderProps): JSX.Element => (
	<div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

type CardTitleProps = ComponentProps<"h3">;

export const CardTitle = ({
	className,
	...props
}: CardTitleProps): JSX.Element => (
	<h3
		className={cn("font-semibold leading-none tracking-tight", className)}
		{...props}
	/>
);

type CardDescriptionProps = ComponentProps<"p">;

export const CardDescription = ({
	className,
	...props
}: CardDescriptionProps): JSX.Element => (
	<p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

type CardContentProps = ComponentProps<"div">;

export const CardContent = ({
	className,
	...props
}: CardContentProps): JSX.Element => (
	<div className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

type CardFooterProps = ComponentProps<"div">;

export const CardFooter = ({
	className,
	...props
}: CardFooterProps): JSX.Element => (
	<div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

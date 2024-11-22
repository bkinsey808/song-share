import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"div">;

export const Card = ({ className, ...props }: CardProps) => (
	<div
		className={cn(
			"rounded-xl border bg-card text-card-foreground shadow",
			className,
		)}
		{...props}
	/>
);

type CardHeaderProps = ComponentProps<"div">;

export const CardHeader = ({ className, ...props }: CardHeaderProps) => (
	<div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

type CardTitleProps = ComponentProps<"h3">;

export const CardTitle = ({ className, ...props }: CardTitleProps) => (
	<h3
		className={cn("font-semibold leading-none tracking-tight", className)}
		{...props}
	/>
);

type CardDescriptionProps = ComponentProps<"p">;

export const CardDescription = ({
	className,
	...props
}: CardDescriptionProps) => (
	<p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

type CardContentProps = ComponentProps<"div">;

export const CardContent = ({ className, ...props }: CardContentProps) => (
	<div className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

type CardFooterProps = ComponentProps<"div">;

export const CardFooter = ({ className, ...props }: CardFooterProps) => (
	<div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

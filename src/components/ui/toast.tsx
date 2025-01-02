"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { type VariantProps, cva } from "class-variance-authority";
import { ComponentProps, JSX, ReactElement } from "react";

import { cn } from "@/lib/utils";

export const ToastProvider = ToastPrimitives.Provider;

type ToastProviderProps = ComponentProps<typeof ToastPrimitives.Provider> & {
	readonly className?: string;
};

export const ToastViewport = ({
	className,
	...props
}: ToastProviderProps): JSX.Element => (
	<ToastPrimitives.Viewport
		className={cn(
			"fixed bottom-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-auto sm:right-0 sm:top-[2rem] sm:flex-col md:max-w-[420px]",
			className,
		)}
		{...props}
	/>
);

const toastVariants = cva(
	"group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
	{
		variants: {
			variant: {
				default: "border bg-background text-foreground",
				destructive:
					"destructive group border-destructive bg-destructive text-destructive-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export type ToastProps = ComponentProps<typeof ToastPrimitives.Root> &
	VariantProps<typeof toastVariants>;

export const Toast = ({
	className,
	variant,
	...props
}: ToastProps): JSX.Element => {
	return (
		<ToastPrimitives.Root
			className={cn(toastVariants({ variant }), className)}
			{...props}
		/>
	);
};

type ToastActionProps = ComponentProps<typeof ToastPrimitives.Action>;

const ToastAction = ({
	className,
	...props
}: ToastActionProps): JSX.Element => (
	<ToastPrimitives.Action
		className={cn(
			"inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
			className,
		)}
		{...props}
	/>
);

type ToastCloseProps = ComponentProps<typeof ToastPrimitives.Close>;

export const ToastClose = ({
	className,
	...props
}: ToastCloseProps): JSX.Element => (
	<ToastPrimitives.Close
		className={cn(
			"absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
			className,
		)}
		toast-close=""
		{...props}
	>
		<Cross2Icon className="h-4 w-4" />
	</ToastPrimitives.Close>
);

type ToastTitleProps = ComponentProps<typeof ToastPrimitives.Title>;

export const ToastTitle = ({
	className,
	...props
}: ToastTitleProps): JSX.Element => (
	<ToastPrimitives.Title
		className={cn("text-sm font-semibold [&+div]:text-xs", className)}
		{...props}
	/>
);

type ToastDescriptionProps = ComponentProps<typeof ToastPrimitives.Description>;

export const ToastDescription = ({
	className,
	...props
}: ToastDescriptionProps): JSX.Element => (
	<ToastPrimitives.Description
		className={cn("text-sm opacity-90", className)}
		{...props}
	/>
);

export type ToastActionElement = ReactElement<typeof ToastAction>;

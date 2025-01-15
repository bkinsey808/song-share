"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as React from "react";
import { ComponentProps, JSX } from "react";

import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = DialogPrimitive.Portal;

export const DialogClose = DialogPrimitive.Close;

type DialogOverlayProps = ComponentProps<typeof DialogPrimitive.Overlay>;

export const DialogOverlay = ({
	className,
	...props
}: DialogOverlayProps): JSX.Element => (
	<DialogPrimitive.Overlay
		className={cn(
			"fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className,
		)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content>;

export const DialogContent = ({
	className,
	children,
	...props
}: DialogContentProps): JSX.Element => (
	<DialogPortal>
		<DialogOverlay />
		<DialogPrimitive.Content
			className={cn(
				"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
				className,
			)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			{children}
			<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
				<Cross2Icon className="h-4 w-4" />
				<span className="sr-only">Close</span>
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</DialogPortal>
);

export const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element => (
	<div
		className={cn(
			"flex flex-col space-y-1.5 text-center sm:text-left",
			className,
		)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

export const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			className,
		)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

type DialogTitleProps = ComponentProps<typeof DialogPrimitive.Title>;

export const DialogTitle = ({
	className,
	...props
}: DialogTitleProps): JSX.Element => (
	<DialogPrimitive.Title
		className={cn(
			"text-lg font-semibold leading-none tracking-tight",
			className,
		)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

type DialogDescriptionProps = ComponentProps<
	typeof DialogPrimitive.Description
>;

export const DialogDescription = ({
	className,
	...props
}: DialogDescriptionProps): JSX.Element => (
	<DialogPrimitive.Description
		className={cn("text-sm text-muted-foreground", className)}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
	/>
);

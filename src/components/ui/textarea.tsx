"use client";

import * as React from "react";

import { useAutoResizeTextarea } from "./use-auto-resize-textarea";
import { cn } from "@/lib/utils";

export type TextareaProps = {
	autoResize?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, autoResize = false, ...props }, ref) => {
		const { textAreaRef } = useAutoResizeTextarea(ref, autoResize);

		return (
			<textarea
				className={cn(
					"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={textAreaRef}
				{...props}
			/>
		);
	},
);

Textarea.displayName = "Textarea";

export { Textarea };

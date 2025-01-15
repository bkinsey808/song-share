"use client";

import { Slot } from "@radix-ui/react-slot";
import {
	ComponentProps,
	JSX,
	ReactNode,
	createContext,
	useContext,
	useId,
} from "react";
import {
	Controller,
	ControllerProps,
	FieldError,
	FieldPath,
	FieldValues,
	FormProvider,
	UseFormReturn,
	useFormContext,
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Form = <T extends Record<string, any>>({
	form,
	children,
}: {
	readonly form: UseFormReturn<T>;
	readonly children: ReactNode;
}): JSX.Element => {
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <FormProvider {...form}>{children}</FormProvider>;
};

// export const Form = FormProvider;

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
);

export const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>): JSX.Element => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		</FormFieldContext.Provider>
	);
};

export const useFormField = (): {
	id: string;
	name: string;
	formItemId: string;
	formDescriptionId: string;
	formMessageId: string;
	isDirty: boolean;
	isTouched: boolean;
	invalid: boolean;
	error?: FieldError;
} => {
	const fieldContext = useContext(FormFieldContext);
	const itemContext = useContext(FormItemContext);
	const { getFieldState, formState } = useFormContext();

	const fieldState = getFieldState(fieldContext.name, formState);

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>");
	}

	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

type FormItemProps = ComponentProps<"div">;

export const FormItem = ({
	className,
	...props
}: FormItemProps): JSX.Element => {
	const id = useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
				className={cn("space-y-2", className)}
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		</FormItemContext.Provider>
	);
};

type FormLabelProps = ComponentProps<typeof Label>;

export const FormLabel = ({
	className,
	...props
}: FormLabelProps): JSX.Element => {
	const { error, formItemId } = useFormField();
	return (
		<Label
			className={cn(error && "text-destructive", "font-bold", className)}
			htmlFor={formItemId}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	);
};
type FormControlProps = ComponentProps<typeof Slot>;

export const FormControl = ({ ...props }: FormControlProps): JSX.Element => {
	const { error, formItemId, formDescriptionId, formMessageId } =
		useFormField();

	return (
		<Slot
			id={formItemId}
			aria-describedby={
				!error
					? `${formDescriptionId}`
					: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	);
};

type FormDescriptionProps = ComponentProps<"p">;

export const FormDescription = ({
	className,
	...props
}: FormDescriptionProps): JSX.Element => {
	const { formDescriptionId } = useFormField();

	return (
		<p
			id={formDescriptionId}
			className={cn("text-[0.8rem] text-muted-foreground", className)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	);
};

type FormMessageProps = ComponentProps<"p">;

export const FormMessage = ({
	className,
	children,
	...props
}: FormMessageProps): JSX.Element | null => {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error?.message) : children;

	if (!body) {
		return null;
	}

	return (
		<p
			id={formMessageId}
			className={cn("text-[0.8rem] font-medium text-destructive", className)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			{body}
		</p>
	);
};

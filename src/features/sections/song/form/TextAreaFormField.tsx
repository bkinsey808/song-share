import { JSX } from "react";

import { SongForm } from "./types";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/features/app-store/useAppStore";

type TextAreaFormFieldProps = {
	readonly name: keyof SongForm;
};

export const TextAreaFormField = ({
	name,
}: TextAreaFormFieldProps): JSX.Element | null => {
	const { songForm } = useAppStore();

	if (!songForm) {
		return null;
	}

	return (
		<FormField
			name={name}
			control={songForm.control}
			render={({ field: { onBlur, onChange, ref, value, disabled } }) => (
				<FormItem>
					<FormControl>
						<Textarea
							autoResize={true}
							disabled={songForm.formState.isSubmitting || !!disabled}
							name={name}
							onBlur={onBlur}
							onChange={onChange}
							ref={ref}
							value={value}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

import { JSX } from "react";

import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/features/app-store/useAppStore";

export const SongNameFormField = (): JSX.Element | null => {
	const { songForm } = useAppStore();

	if (!songForm) {
		return null;
	}

	return (
		<FormField
			name="songName"
			control={songForm.control}
			render={({ field: { name, onBlur, onChange, ref, value, disabled } }) => (
				<FormItem className="flex-1">
					<FormControl>
						<Input
							placeholder="Song Name"
							disabled={!!songForm?.formState.isSubmitting || !!disabled}
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

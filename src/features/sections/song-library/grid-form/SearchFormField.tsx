import { JSX } from "react";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/features/app-store/useAppStore";

export const SearchFormField = (): JSX.Element | null => {
	const { songLibraryGridForm } = useAppStore();

	if (!songLibraryGridForm) {
		return null;
	}

	return (
		<FormField
			name="search"
			control={songLibraryGridForm.control}
			render={({ field: { name, onBlur, onChange, ref, value, disabled } }) => (
				<FormItem className="w-[10rem] flex-grow">
					<FormLabel>Search</FormLabel>
					<FormControl>
						<Input
							className="h-[1.6rem]"
							name={name}
							onBlur={onBlur}
							onChange={onChange}
							ref={ref}
							value={value}
							disabled={!!disabled}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};

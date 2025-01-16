import { JSX, useState } from "react";

import { songLibrarySortDefault, songLibrarySortOptions } from "./consts";
import { Combobox } from "@/components/ui/combobox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { useAppStore } from "@/features/app-store/useAppStore";

export const SortFormField = (): JSX.Element | null => {
	const { songLibraryGridForm } = useAppStore();
	const [sortSearch, setSortSearch] = useState("");

	if (!songLibraryGridForm) {
		return null;
	}

	return (
		<FormField
			name="sort"
			control={songLibraryGridForm.control}
			render={({ field: { onChange, ref, value, disabled } }) => {
				return (
					<FormItem className="h-[3rem] w-[10rem]">
						<FormLabel>Sort</FormLabel>
						<FormControl>
							<Combobox
								label={"sort"}
								onChange={onChange}
								options={songLibrarySortOptions}
								ref={ref}
								value={value}
								search={sortSearch}
								setSearch={setSortSearch}
								valueDefault={songLibrarySortDefault}
								disabled={
									songLibraryGridForm.formState.isSubmitting || !!disabled
								}
							/>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
};

import { JSX, useState } from "react";

import { keys } from "../consts";
import { keyOptionsWithNone } from "./consts";
import { Combobox } from "@/components/ui/combobox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useAppStore } from "@/features/app-store/useAppStore";

export const SongKeyFormField = (): JSX.Element | null => {
	const { songForm } = useAppStore();

	const [songKeySearch, songKeySearchSet] = useState("");

	if (!songForm) {
		return null;
	}

	return (
		<FormField
			name="songKeyString"
			control={songForm.control}
			render={({ field }) => {
				const onChange = (newValue: string): void => {
					field.onChange(newValue);
					songForm.setValue("songKey", keys[newValue as keyof typeof keys]);
				};
				const options = keyOptionsWithNone.filter((option) =>
					option.search.includes(songKeySearch.toLocaleLowerCase()),
				);
				const disabled = songForm.formState.isSubmitting || !!field.disabled;
				return (
					<FormItem>
						{/* Field value: {form.getValues().songKey},{" "}
                  {keyMap.get(form.getValues().songKey)} */}
						<FormLabel>Song Key</FormLabel>
						<FormControl>
							<Combobox
								options={options}
								onChange={onChange}
								search={songKeySearch}
								setSearch={songKeySearchSet}
								label="song key"
								disabled={disabled}
								value={field.value}
								ref={field.ref}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
};

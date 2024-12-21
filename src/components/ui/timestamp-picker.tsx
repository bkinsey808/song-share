import { ComponentProps } from "react";

import { DateTimePicker } from "./datetime-picker";
import { appDateTimeFormat } from "@/features/time-zone/consts";
import { jsDateTimeZone2iso } from "@/features/time-zone/jsDateTimeZone2iso";

type TimestampPickerProps = {
	readonly value: string | undefined;
	readonly onChange: (timestamp: string | undefined) => void;
	readonly timeZone: string; // Add timezone prop
} & Omit<ComponentProps<typeof DateTimePicker>, "value" | "onChange">;

export const TimestampPicker = ({
	value,
	onChange,
	timeZone,
	ref,
	...props
}: TimestampPickerProps) => {
	const handleChange = (date: Date | undefined) => {
		if (date) {
			const isoDate = jsDateTimeZone2iso(date, "UTC");
			onChange(isoDate);
		} else {
			onChange(undefined);
		}
	};

	const converted = value
		? jsDateTimeZone2iso(new Date(value), timeZone)
		: undefined;

	const zonedIsoDate = converted ? new Date(converted) : undefined;

	return (
		<DateTimePicker
			ref={ref}
			value={zonedIsoDate}
			onChange={handleChange}
			displayFormat={{ hour24: appDateTimeFormat }}
			{...props}
		/>
	);
};

import { ComponentProps, forwardRef } from "react";

import { DateTimePicker, DateTimePickerRef } from "./datetime-picker";
import { convertDateToISOWithOffset } from "@/features/time-zone/convertDateToISOWithOffset";

type TimestampPickerProps = {
	value: string | undefined;
	onChange: (timestamp: string | undefined) => void;
	timeZone: string; // Add timezone prop
} & Omit<ComponentProps<typeof DateTimePicker>, "value" | "onChange">;

const TimestampPicker = forwardRef<
	Partial<DateTimePickerRef>,
	TimestampPickerProps
>(({ value, onChange, timeZone, ...props }: TimestampPickerProps, ref) => {
	const handleChange = (date: Date | undefined) => {
		if (date) {
			const isoDate = convertDateToISOWithOffset(date, "UTC");
			onChange(isoDate);
		} else {
			onChange(undefined);
		}
	};

	const converted = value
		? convertDateToISOWithOffset(new Date(value), timeZone)
		: undefined;

	const zonedIsoDate = converted ? new Date(converted) : undefined;

	return (
		<DateTimePicker
			ref={ref}
			value={zonedIsoDate}
			onChange={handleChange}
			{...props}
		/>
	);
});
TimestampPicker.displayName = "TimestampPicker";

export default TimestampPicker;

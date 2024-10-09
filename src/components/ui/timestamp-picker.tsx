import { ComponentProps, forwardRef } from "react";

import { DateTimePicker, DateTimePickerRef } from "./datetime-picker";
import { appDateTimeFormat } from "@/features/time-zone/consts";
import { jsDateTimeZone2iso } from "@/features/time-zone/jsDateTimeZone2iso";

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
});
TimestampPicker.displayName = "TimestampPicker";

export default TimestampPicker;

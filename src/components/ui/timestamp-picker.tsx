import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { Timestamp } from "firebase/firestore";
import React, { ComponentProps } from "react";

import { DateTimePicker } from "./datetime-picker";

type TimestampPickerProps = {
	value: Timestamp | undefined;
	onChange: (timestamp: Timestamp | undefined) => void;
	timezone: string; // Add timezone prop
} & Omit<ComponentProps<typeof DateTimePicker>, "value" | "onChange">;

const TimestampPicker: React.FC<TimestampPickerProps> = ({
	value,
	onChange,
	timezone,
	...props
}) => {
	const handleChange = (date: Date | undefined) => {
		if (date) {
			const utcDate = fromZonedTime(date, timezone);
			onChange(Timestamp.fromDate(utcDate));
		} else {
			onChange(undefined);
		}
	};

	const zonedValue = value ? toZonedTime(value.toDate(), timezone) : undefined;

	return (
		<DateTimePicker value={zonedValue} onChange={handleChange} {...props} />
	);
};

export default TimestampPicker;

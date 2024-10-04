"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { LogSchema } from "./schemas";
import { Log } from "./types";
import TimestampPicker from "@/components/ui/timestamp-picker";

export const LogSection = () => {
	const form = useForm<Log>({
		resolver: valibotResolver(LogSchema),
	});

	// const [date, setDate] = useState<Date | undefined>(undefined);
	const [timestamp, setTimestamp] = useState<Timestamp | undefined>(undefined);

	return (
		<section data-title="Log Section">
			log section
			<div>
				utc time:{" "}
				{timestamp?.toDate()
					? format(timestamp?.toDate(), "yyyy/MM/dd HH:mm")
					: ""}
			</div>
			<div>
				local time:{" "}
				{timestamp?.toDate()
					? format(
							toZonedTime(timestamp?.toDate(), "America/New_York"),
							"yyyy/MM/dd HH:mm",
						)
					: ""}
			</div>
			{/* <DateTimePicker displayFormat={{ hour24: 'yyyy/MM/dd HH:mm' }} value={timestamp?.toDate()} onChange={(date) => date ? setTimestamp(Timestamp.fromDate(date)): undefined} className="w-[280px]" /> */}
			<TimestampPicker
				displayFormat={{ hour24: "yyyy/MM/dd HH:mm" }}
				value={timestamp}
				onChange={setTimestamp}
				className="w-[280px]"
				timezone="America/New_York"
			/>
		</section>
	);
};

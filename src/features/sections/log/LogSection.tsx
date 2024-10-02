"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";

import { LogSchema } from "./schemas";
import { Log } from "./types";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import TimestampPicker from "@/components/ui/timestamp-picker";

export const LogSection = () => {
	const form = useForm<Log>({
		resolver: valibotResolver(LogSchema),
	});

  // const [date, setDate] = useState<Date | undefined>(undefined);
  const [timestamp, setTimestamp] = useState<Timestamp | undefined>(undefined);

	return <section data-title="Log Section">log section
  {/* <DateTimePicker displayFormat={{ hour24: 'yyyy/MM/dd HH:mm' }} value={timestamp?.toDate()} onChange={(date) => date ? setTimestamp(Timestamp.fromDate(date)): undefined} className="w-[280px]" /> */}
  <TimestampPicker displayFormat={{ hour24: 'yyyy/MM/dd HH:mm' }} value={timestamp} onChange={setTimestamp} className="w-[280px]" />
  </section>;
};

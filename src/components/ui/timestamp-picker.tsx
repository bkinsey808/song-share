import React, { ComponentProps } from 'react';
import { Timestamp } from 'firebase/firestore';
import { DateTimePicker } from './datetime-picker';

interface TimestampPickerProps extends Omit<ComponentProps<typeof DateTimePicker>, 'value' | 'onChange'> {
  value: Timestamp | undefined;
  onChange: (timestamp: Timestamp | undefined) => void;
}

const TimestampPicker: React.FC<TimestampPickerProps> = ({ value, onChange, ...props }) => {
  const handleChange = (date: Date | undefined) => {
    if (date) {
      onChange(Timestamp.fromDate(date));
    } else {
      onChange(undefined);
    }
  };

  return (
    <DateTimePicker
      value={value ? value.toDate() : undefined}
      onChange={handleChange}
      {...props}
    />
  );
};

export default TimestampPicker;
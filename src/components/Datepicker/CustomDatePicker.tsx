import { Ref, forwardRef, useEffect, useState } from "react";
import { Datepicker } from "flowbite-react";
import { format } from "date-fns";
import { convertToThaiFormat } from "@/utils";

const theme = {
  root: {
    input: {
      field: {
        input: {
          base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm !pr-10 !pl-2.5 rounded-lg !leading-6",
        },
        icon: {
          base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
        },
      },
    },
  },
};

type CustomDatePickerProps = {
  value: Date | null;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  onChange: (date: string) => void;
  placeholder?: string;
};

const CustomDatePicker = forwardRef(function CustomDatePicker(
  props: CustomDatePickerProps,
  ref: Ref<any>
) {
  const {
    value,
    disabled = false,
    minDate,
    maxDate,
    onChange,
    placeholder = "วัน/เดือน/ปี",
  } = props;

  const [dateSelected, setDateSelected] = useState<Date>(
    value ? new Date(value) : new Date()
  );

  const [dateString, setDateString] = useState("");

  useEffect(() => {
    if (dateSelected && value !== null) {
      setDateString(convertToThaiFormat(format(dateSelected, "dd/MM/yyyy")));
    }
  }, [dateSelected, value]);

  useEffect(() => {
    if (value) setDateSelected(new Date(value));
  }, [value]);

  return (
    <div ref={ref}>
      <Datepicker
        theme={theme}
        minDate={minDate}
        maxDate={maxDate}
        language="th-th"
        labelTodayButton="วันนี้"
        labelClearButton="ยกเลิก"
        defaultDate={dateSelected}
        value={dateString}
        placeholder={placeholder}
        disabled={disabled}
        onSelectedDateChanged={(date: Date) => {
          setDateSelected(date);
          onChange(format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
        }}
      />
    </div>
  );
});

CustomDatePicker.displayName = "CustomDatePicker";

export default CustomDatePicker;

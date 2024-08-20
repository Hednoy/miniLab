import { Downshift } from "@/components/Downshift";
import { Button } from "flowbite-react";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import "./ServiceFilterForm.css";
type ServiceFilterForm = {
  province: string;
  oranization: string;
  status: string;
};

type FilterType = {
  tambonId?: number;
  amphureId?: number;
  statusId?: number;
  provinceId?: number;
};

type ServiceFilterFormProps = {
  provinceOptions: { value: string; id?: string }[];
  oranizationOptions: { value: string; id?: string }[];
  statusOptions: { value: string; id?: string }[];
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

const ServiceFilterForm: FC<ServiceFilterFormProps> = ({
  provinceOptions,
  oranizationOptions,
  statusOptions,
  setFilter,
}) => {
  const form = useForm<ServiceFilterForm>();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Controller
            control={form.control}
            name="province"
            render={({ field }) => (
              <Downshift
                {...field}
                options={provinceOptions}
                placeholder="จังหวัด"
                title="จังหวัด"
                onChange={(v) => {
                  field.onChange(v.id);
                }}
                value={field.value}
              />
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="oranization"
          render={({ field }) => (
            <Downshift
              {...field}
              options={oranizationOptions}
              placeholder="องค์กร"
              title="องค์กร"
              onChange={(v) => {
                field.onChange(v.id);
              }}
              value={field.value}
            />
          )}
        />

        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Downshift
              {...field}
              options={statusOptions}
              placeholder="สถานะ"
              title="สถานะ"
              onChange={(v) => {
                field.onChange(v.id);
              }}
              value={field.value}
            />
          )}
        />
      </div>

      <div className="flex flex-row justify-end gap-4">
        <Button
          onClick={() => {
            setFilter({});
          }}
          color="warning"
        >
          ล้าง
        </Button>
        <Button
          onClick={() => {
            let filterValues: {
              amphureId?: number;
              statusId?: number;
              provinceId?: number;
            } = {};

            if (form.getValues().oranization && form.getValues().oranization) {
              filterValues = {
                ...filterValues,
                amphureId: parseInt(form.getValues().oranization, 10),
              };
            }

            // Check if form.getValues().status.id is defined before accessing it
            if (form.getValues().status && form.getValues().status) {
              filterValues = {
                ...filterValues,
                statusId: parseInt(form.getValues().status, 10),
              };
            }

            // Check if form.getValues().province.id is defined before accessing it
            if (form.getValues().province && form.getValues().province) {
              filterValues = {
                ...filterValues,
                provinceId: parseInt(form.getValues().province, 10),
              };
            }

            setFilter((prev) => ({
              ...prev,
              ...filterValues,
            }));

            console.log(filterValues);
            console.log(form.getValues());
          }}
        >
          ค้นหา
        </Button>
      </div>
    </div>
  );
};

export default ServiceFilterForm;

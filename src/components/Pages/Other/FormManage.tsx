import { Label, Select, TextInput, Textarea } from "flowbite-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type FormManageProps = {
  id: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function OtherFormManage(props: FormManageProps): JSX.Element {
  const {
    handleSubmit,
    formState: { errors },
    control,
    trigger,
  } = useForm<any>({
    reValidateMode: "onChange",
  });

  //TODO : Restructure
  async function onSubmit(data: any) {
    console.log("data", data);
  }

  const { back } = useRouter();
  return (
    <div>
      <div className="mb-6 flex items-center justify-start">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          FM 02-007(A)
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center px-60 py-20"
      >
        <div className="col-span-1 grid w-full gap-3">
          <div>
            <div className="flex gap-2">
              <Label htmlFor="name" value={`ชื่อแบบฟอร์ม`} />
              <p className="text-[12px] text-lightgray">
                ตัวอย่างเช่น : FM 02-007(A)
              </p>
            </div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="name"
                  type="text"
                  required
                  {...field}
                  onFocus={() => {
                    trigger("name");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.name && (
                <p className=" text-red-500">{String(errors.name.message)}</p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="program" value={`โปรแกรมการตรวจ`} />
            </div>
            <Controller
              control={control}
              name="program"
              render={({ field, fieldState }) => (
                <Select
                  onChange={(value) => {
                    field.onChange(value.target.value);
                  }}
                  helperText={fieldState.error?.message}
                  color={
                    (Boolean(fieldState?.error?.message) && "failure") ||
                    undefined
                  }
                >
                  <option value="">เลือก</option>
                </Select>
              )}
            />
            <div className="text-start">
              {errors.program && (
                <p className=" text-red-500">
                  {String(errors.program.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="detail" value={`รายละเอียดการตรวจ`} />
            </div>
            <Controller
              name="detail"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="detail"
                  rows={4}
                  required
                  {...field}
                  onFocus={() => {
                    trigger("detail");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.detail && (
                <p className=" text-red-500">{String(errors.detail.message)}</p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="virus_type" value={`ชนิดไวรัส`} />
            </div>
            <Controller
              control={control}
              name="virus_type"
              render={({ field, fieldState }) => (
                <Select
                  onChange={(value) => {
                    field.onChange(value.target.value);
                  }}
                  helperText={fieldState.error?.message}
                  color={
                    (Boolean(fieldState?.error?.message) && "failure") ||
                    undefined
                  }
                >
                  <option value="">เลือก</option>
                </Select>
              )}
            />
            <div className="text-start">
              {errors.virus_type && (
                <p className=" text-red-500">
                  {String(errors.virus_type.message)}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <button
            type="button"
            className={` mt-10  rounded-[5px] bg-secondary px-4 py-1 text-sm font-semibold !no-underline`}
            onClick={() => back()}
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            className={` mt-10 rounded-[5px] bg-primary px-4 py-1 text-sm font-semibold text-white !no-underline`}
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}

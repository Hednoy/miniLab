import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { useYupValidationResolver } from "@/components/hooks";
import { Routes } from "@/lib-client/constants";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import {
  useCreatePathogens,
  usePathogensById,
  useUpdatePathogens,
} from "@/lib-client/react-query/pathogens";
import { useTestTypeAll } from "@/lib-client/react-query/test-type";
import {
  PathogensCreateFormData,
  PathogensUpdateForm,
} from "@/types/models/Pathogens";
import { Label, TextInput, Textarea } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

type OtherPathogensManageProps = {
  id: number;
};

export interface NewPathogensCreateFormData extends PathogensCreateFormData {
  test_type_id?: number[];
}

export default function OtherPathogensManage({
  id,
}: OtherPathogensManageProps): React.JSX.Element {
  const { data, isLoading, isSuccess } = usePathogensById(id, {
    enabled: !!id && !isNaN(id),
  });

  const { mutate: createPathogens } = useCreatePathogens();
  const { mutate: updatePathogens } = useUpdatePathogens();
  const { push, back } = useRouter();

  const { data: testTypeData } = useTestTypeAll();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
  } = useForm<NewPathogensCreateFormData>({
    reValidateMode: "onChange",
    resolver: useYupValidationResolver(
      yup.object({
        name: yup.string().required("กรุณากรอกชื่อ Pathogen"),
        description: yup.string().required("กรุณากรอกรายละเอียด"),
      })
    ),
    values: data,
  });
  const { mutate: createLog } = useCreateLogAction();

  async function onSubmit(pathogensData: PathogensCreateFormData) {
    if (isNaN(id)) {
      createPathogens(pathogensData, {
        onSuccess: () => {
          createLog({ action: "เพิ่มข้อมูล Pathogens" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.OTHER.PATHOGENTS}`);
        },
        onError: (error: any) => {
          swal.fire({
            title: "พบข้อผิดพลาด",
            icon: "success",
            iconHtml: customIcons.error,
          });
        },
      });
    } else {
      const updatePathogensData: PathogensUpdateForm = {
        id: id,
        ...pathogensData,
      };

      updatePathogens(updatePathogensData, {
        onSuccess: () => {
          createLog({ action: "แก้ไขข้อมูล Pathogens" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.OTHER.PATHOGENTS}`);
        },
        onError: (error: any) => {
          swal.fire({
            title: "พบข้อผิดพลาด",
            icon: "success",
            iconHtml: customIcons.error,
          });
        },
      });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-start">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          Pathogen
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        // className="flex flex-col items-center justify-center px-3 py-10 md:px-20 md:py-20 lg:px-40 xl:px-80"
        className="flex flex-col items-center justify-center"
      >
        <div className="mb-6 grid w-full grid-cols-1 gap-3 rounded-xl p-10 shadow-md shadow-gray">
          <div>
            <div className="block">
              <Label htmlFor="name" value={`Pathogen`} />
            </div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("name")}
                  id="name"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
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
              <Label htmlFor="" value={`รายการตรวจวิเคราะห์ (Test Name)`} />
            </div>

            <Controller
              name="test_type_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  mainKeyId="id"
                  mainKey="prefix_name"
                  option={testTypeData}
                  mode="multiple"
                  // className="min-h-20"
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />

            <div className="mt-4 text-start">
              {errors.test_type_id && (
                <p className=" text-red-500">
                  {String(errors.test_type_id.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="name" value={`รายละเอียด`} />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  onFocus={() => {
                    trigger("description");
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("description");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.description && (
                <p className=" text-red-500">
                  {String(errors.description.message)}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
          <button
            type="button"
            className={`rounded-[5px] bg-secondary px-4 py-2 text-sm font-semibold !no-underline md:col-span-1`}
            onClick={() => back()}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className={`rounded-[5px] bg-primary px-4 py-2 text-sm font-semibold text-white !no-underline md:col-span-1`}
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}

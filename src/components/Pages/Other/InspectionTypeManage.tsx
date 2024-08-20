import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { useYupValidationResolver } from "@/components/hooks";
import { Routes } from "@/lib-client/constants";
import {
  useCreateInspectionType,
  useInspectionTypeById,
  useUpdateInspectionType,
} from "@/lib-client/react-query/inspection-type";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import {
  InspectionTypeCreateFormData,
  InspectionTypeUpdateForm,
} from "@/types/models/InspectionType";
import { Label, TextInput, Textarea } from "flowbite-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
type InspectionTypeManageProps = {
  id: number;
};

export default function OtherInspectionTypeManage({
  id,
}: InspectionTypeManageProps): React.JSX.Element {
  const { mutate: createInspection } = useCreateInspectionType();
  const { mutate: updateInspection } = useUpdateInspectionType();
  const { push, back } = useRouter();

  const { data, isLoading, isSuccess } = useInspectionTypeById(id, {
    enabled: !!id && !isNaN(id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
  } = useForm<InspectionTypeCreateFormData>({
    reValidateMode: "onChange",
    resolver: useYupValidationResolver(
      yup.object({
        name: yup.string().required("กรุณากรอกชื่อชนิดสิ่งตรวจ"),
        description: yup.string().required("กรุณากรอกรายละเอียด"),
      })
    ),
    values: data,
  });
  const { mutate: createLog } = useCreateLogAction();

  async function onSubmit(inspectionTypeData: InspectionTypeCreateFormData) {
    inspectionTypeData.code = "";
    if (isNaN(id)) {
      createInspection(inspectionTypeData, {
        onSuccess: () => {
          createLog({ action: "เพิ่มข้อมูลชนิดสิ่งตรวจ" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.OTHER.INSPECTION_TYPE}`);
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
      const updateInspectionData: InspectionTypeUpdateForm = {
        id: id,
        ...inspectionTypeData,
      };

      updateInspection(updateInspectionData, {
        onSuccess: () => {
          createLog({ action: "แก้ไขข้อมูลชนิดสิ่งตรวจ" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.OTHER.INSPECTION_TYPE}`);
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
          ชนิดสิ่งตรวจ
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center px-3 py-10 md:px-20 md:py-20 lg:px-40 xl:px-80"
      >
        <div className="mb-6 grid w-full grid-cols-1 gap-3 rounded-xl p-10 shadow-md shadow-gray">
          <div>
            <div className="block">
              <Label htmlFor="name" value={`ชนิดสิ่งตรวจ`} />
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
            <Label htmlFor="description" value={`รายละเอียด`} />
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

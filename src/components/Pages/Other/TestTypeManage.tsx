import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { useYupValidationResolver } from "@/components/hooks";
import { Routes } from "@/lib-client/constants";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import {
  useTestTypeById,
  useUpdateTestType,
} from "@/lib-client/react-query/test-type";
import { useCreateTestType } from "@/lib-client/react-query/test-type/useCreateTestType";
import {
  TestTypeCreateFormData,
  TestTypeUpdateForm,
} from "@/types/models/TestType";
import { Label, TextInput, Textarea } from "flowbite-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
type TestTypeManageProps = {
  id: number;
};

export default function OtherTestTypeManage({
  id,
}: TestTypeManageProps): JSX.Element {
  const { data, isLoading, isSuccess } = useTestTypeById(id, {
    enabled: !!id && !isNaN(id),
  });

  const { mutate: createTestType } = useCreateTestType();
  const { mutate: updateTestType } = useUpdateTestType();
  const { push, back } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
  } = useForm<TestTypeCreateFormData>({
    reValidateMode: "onChange",
    resolver: useYupValidationResolver(
      yup.object({
        prefix_name: yup.string().required("กรุณากรอกโปรแกรมรายการตรวจ"),
        subfix_name: yup.string().required("กรุณากรอกหลักการตรวจ"),
      })
    ),
    values: data,
  });

  const { mutate: createLog } = useCreateLogAction();

  async function onSubmit(testTypeData: TestTypeCreateFormData) {
    if (isNaN(id)) {
      createTestType(testTypeData, {
        onSuccess: () => {
          createLog({ action: "เพิ่มข้อมูลหลักการตรวจ" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.OTHER.TEST_TYPE}`);
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
      const updateTestTypeData: TestTypeUpdateForm = {
        id: id,
        ...testTypeData,
      };

      updateTestType(updateTestTypeData, {
        onSuccess: () => {
          createLog({ action: "แก้ไขข้อมูลหลักการตรวจ" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.OTHER.TEST_TYPE}`);
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
          เพิ่มโปรแกรมรายตรวจ
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center px-3 py-10 md:px-20 md:py-20 lg:px-40 xl:px-80"
      >
        <div className="mb-6 grid w-full grid-cols-1 gap-3 rounded-xl p-10 shadow-md shadow-gray">
          <div>
            <div className="block">
              <Label htmlFor="prefix_name" value={`โปรแกรมรายการตรวจ`} />
            </div>
            <Controller
              name="prefix_name"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("prefix_name")}
                  id="name"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("prefix_name");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.prefix_name && (
                <p className=" text-red-500">
                  {String(errors.prefix_name.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="principle" value={`หลักการตรวจ`} />
            </div>
            <Controller
              name="subfix_name"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("subfix_name")}
                  id="name"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("subfix_name");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.subfix_name && (
                <p className=" text-red-500">
                  {String(errors.subfix_name.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex gap-2">
              <Label htmlFor="name" value={`รายละเอียด`} />
              <p className="text-[12px] text-lightgray">(ไม่จำเป็นต้องระบุ)</p>
            </div>
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

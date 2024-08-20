import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { useYupValidationResolver } from "@/components/hooks";
import { Routes } from "@/lib-client/constants";
import { useCreateHospital } from "@/lib-client/react-query/hospital";
import { useHospitalById } from "@/lib-client/react-query/hospital/useHospital";
import { useUpdateHospital } from "@/lib-client/react-query/hospital/useUpdateHospital";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import {
  HospitalCreateFormData,
  HospitalUpdateData,
  HospitalUpdateForm,
  HospitalUpdateMutationData,
} from "@/types/models/Hospital";
import { digitsOnly } from "@/utils";
import { Label, TextInput, Textarea } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

type HospitalManageProp = {
  id: number;
};

export default function OtherHospitalManage({ id }: HospitalManageProp) {
  const { data, isLoading } = useHospitalById(id, {
    enabled: !!id && !isNaN(id),
  });

  const { mutate: updateHospital } = useUpdateHospital();
  const { mutate: createHospital } = useCreateHospital();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
    trigger,
    reset,
  } = useForm<HospitalCreateFormData>({
    reValidateMode: "onChange",
    resolver: useYupValidationResolver(
      yup.object({
        name: yup.string().required("กรุณากรอกชื่อหน่วยงาน"),
        address: yup.string().required("กรุณากรอกที่อยู่หน่วยงาน"),
        phone_no: yup
          .string()
          .max(10, "รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง")
          .test("Digits only", "กรุณากรอกตัวเลขเท่านั้น", digitsOnly)
          .required("กรุณากรอกหมายเลขโทรศัพท์"),
      })
    ),
    values: data,
  });

  const { push, back } = useRouter();
  const { mutate: createLog } = useCreateLogAction();

  async function onSubmit(hospitalData: HospitalCreateFormData) {
    if (isNaN(id)) {
      createHospital(hospitalData, {
        onSuccess: () => {
          createLog({ action: "เพิ่มข้อมูลหน่วยงาน" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.OTHER.HOSPITAL}`);
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
      const updateHospitalData: HospitalUpdateForm = {
        id: id,
        name: hospitalData.name,
        address: hospitalData.address,
        phone_no: hospitalData.phone_no,
      };

      updateHospital(updateHospitalData, {
        onSuccess: () => {
          createLog({ action: "แก้ไขข้อมูลหน่วยงาน" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.OTHER.HOSPITAL}`);
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
          เพิ่มรายชื่อหน่วยงาน
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center px-3 py-10 md:px-20 md:py-20 lg:px-40 xl:px-80"
      >
        <div className="mb-6 grid w-full grid-cols-1 gap-3 rounded-xl p-10 shadow-md shadow-gray">
          <div>
            <div className="block">
              <Label htmlFor="name" value={`รายชื่อหน่วยงาน`} />
            </div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("name")}
                  type="text"
                  required
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
              <Label htmlFor="address" value={`ที่อยู่หน่วยงาน`} />
            </div>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...register("address")}
                  rows={4}
                  required
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("address");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.address && (
                <p className=" text-red-500">
                  {String(errors.address.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="phone_no" value={`หมายเลขโทรศัพท์`} />
            </div>
            <Controller
              name="phone_no"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("phone_no")}
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("phone_no");
                  }}
                  required
                />
              )}
            />
            <div className="text-start">
              {errors.phone_no && (
                <p className=" text-red-500">
                  {String(errors.phone_no.message)}
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

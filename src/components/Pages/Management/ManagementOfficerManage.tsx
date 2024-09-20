import { Dialog } from "@/components/Dialog";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { useYupValidationResolver } from "@/components/hooks";
import { Routes } from "@/lib-client/constants";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import {
  useCreateOfficer,
  useOfficerById,
  useUpdateOfficer,
} from "@/lib-client/react-query/officer";
import { useRoles } from "@/lib-client/react-query/role";
import { OfficerCreateFormData, OfficerUpdateForm } from "@/types/models";
import { digitsOnly } from "@/utils";
import { Label, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

type ManagementOfficerManageProp = {
  id: number;
};

export default function ManagementOfficerManage({
  id,
}: ManagementOfficerManageProp) {
  const { push, back } = useRouter();

  const { data, isLoading, isSuccess } = useOfficerById(id, {
    enabled: !!id && !isNaN(id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
    trigger,
    reset,
  } = useForm<OfficerCreateFormData>({
    reValidateMode: "onChange",
    resolver: useYupValidationResolver(
      yup.object({
        id: yup.number(),
        first_name: yup.string().required("กรุณากรอกชื่อ"),
        last_name: yup.string().required("กรุณากรอกชื่อนามสกุล"),
        citizen_id: yup
          .string()
          .required("กรุณากรอกอายุ")
          .length(13, "กรุณากรอกให้ครบ 13 หลัก")
          .test("Digits only", "กรุณากรอกตัวเลขเท่านั้น", digitsOnly),
        nickname: yup.string().required("กรุณากรอกชื่อเล่น"),
        mobile_phone: yup
          .string()
          .required("กรุณากรอกหมายเลขโทรศัพท์")
          .length(10, "รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง")
          .test("Digits only", "กรุณากรอกตัวเลขเท่านั้น", digitsOnly),
        role_id: yup.string().required("กรุณาเลือกตำแหน่ง"),
        department: yup.string().required("กรุณากรอกแผนก"),
        email: yup
          .string()
          .required("กรุณากรอกอีเมล")
          .email("รูปแบบอีเมลไม่ถูกต้อง"),
        username: yup.string().required("กรุณากรอกชื่อผู้ใช้งาน"),
        password: yup
          .string()
          .required("กรุณากรอกรหัสผ่าน")
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
            message:
              "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษรพิมพ์ใหญ่/พิมพ์เล็ก ตัวเลข และอักขระพิเศษหนึ่งตัว",
          }),
      })
    ),
    values: data,
  });

  const { mutate: createOfficer } = useCreateOfficer();
  const { mutate: updateOfficer } = useUpdateOfficer();
  const { mutate: createLog } = useCreateLogAction();

  async function onSubmit(officerData: OfficerCreateFormData) {
    officerData.role_id = Number(officerData.role_id);
    if (isNaN(id)) {
      createOfficer(officerData, {
        onSuccess: () => {
          createLog({ action: "เพิ่มข้อมูล officer" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.MANAGEMENT.OFFICER}`);
        },
        onError: (error: any) => {
          console.log("error");
          swal.fire({
            title: "พบข้อผิดพลาด",
            html: error.response.data,
            icon: "success",
            iconHtml: customIcons.error,
          });
        },
      });
    } else {
      const updateRoleData: OfficerUpdateForm = {
        id: id,
        ...officerData,
      };
      updateOfficer(updateRoleData, {
        onSuccess: () => {
          createLog({ action: "แก้ไขข้อมูล officer" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.MANAGEMENT.OFFICER}`);
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

  const { data: rolesData } = useRoles({
    page: 1,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-start">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          {id == 0 ? "เพิ่มผู้ใช้งาน" : "ผู้ใช้งาน"}
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center px-3 py-10 md:px-20 md:py-20 lg:px-40 xl:px-80"
      >
        <div className="mb-6 grid w-full grid-cols-2  gap-3 rounded-xl p-10 shadow-md shadow-gray">
          <div>
            <div className="block">
              <Label htmlFor="firstname" value={`ชื่อ`} />
            </div>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("first_name")}
                  id="first_name"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("first_name");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.first_name && (
                <p className=" text-red-500">{errors.first_name.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="last_name" value={`นามสกุล`} />
            </div>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("last_name")}
                  id="last_name"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("last_name");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.last_name && (
                <p className=" text-red-500">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="citizen_id" value={`หมายเลขบัตรประชาชน`} />
            </div>
            <Controller
              name="citizen_id"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("citizen_id")}
                  id="citizen_id"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("citizen_id");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.citizen_id && (
                <p className=" text-red-500">{errors.citizen_id.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="nickname" value={`ชื่อเล่น`} />
            </div>
            <Controller
              name="nickname"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("nickname")}
                  id="nickname"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("nickname");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.nickname && (
                <p className=" text-red-500">{errors.nickname.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="phonenumber" value={`หมายเลขโทรศัพท์`} />
            </div>
            <Controller
              name="mobile_phone"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("mobile_phone")}
                  id="mobile_phone"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("mobile_phone");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.mobile_phone && (
                <p className=" text-red-500">{errors.mobile_phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="role_id" value={`ตำแหน่งงาน`} />
            </div>
            <Controller
              name="role_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...register("role_id")}
                  id="role_id"
                  value={String(field.value)}
                  onChange={(e) => {
                    field.onChange(
                      e.target.value === "0" ? undefined : e.target.value
                    );
                    trigger("role_id");
                  }}
                >
                  <option value="">กรุณาเลือกตำแหน่ง</option>
                  {rolesData.map((item: any, index: number) => (
                    <option value={item.role_id} key={index}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              )}
            />
            <div className="text-start">
              {errors.role_id && (
                <p className=" text-red-500">{errors.role_id.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="department" value={`แผนก`} />
            </div>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("department")}
                  id="department"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("department");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.department && (
                <p className=" text-red-500">{errors.department.message}</p>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="email" value={`E-mail`} />
            </div>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("email")}
                  id="email"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("email");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="username" value={`Username`} />
            </div>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("username")}
                  id="username"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("username");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.username && (
                <p className=" text-red-500">{errors.username.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="password" value={`Password`} />
            </div>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  id="password"
                  type="password"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    trigger("password"); // Ensure this triggers validation
                  }}
                />
              )}
            />

            <div className="text-start">
              {errors.password && (
                <p className=" text-red-500">{errors.password.message}</p>
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

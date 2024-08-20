import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { useYupValidationResolver } from "@/components/hooks";
import { Routes } from "@/lib-client/constants";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import {
  useCreateRole,
  useRoleById,
  useUpdateRole,
} from "@/lib-client/react-query/role";
import { RoleCreateFormData, RoleUpdateForm } from "@/types/models/Role";
import { Checkbox, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

type ManagementRoleManageProp = {
  id: number;
};

export default function ManagementRoleManage({ id }: ManagementRoleManageProp) {
  const { data, isLoading, isSuccess } = useRoleById(id, {
    enabled: !!id && !isNaN(id),
  });

  const [permission_patient, setpermission_patient] = useState(
    data?.permission_patient ? true : false
  );

  const [permission_lab, setpermission_lab] = useState(
    data?.permission_lab ? true : false
  );

  const [permission_data, setpermission_data] = useState(
    data?.permission_data ? true : false
  );

  const [permission_management, setpermission_management] = useState(
    data?.permission_management ? true : false
  );

  const [permission_news, setpermission_news] = useState(
    data?.permission_news ? true : false
  );

  const [permission_history, setpermission_history] = useState(
    data?.permission_history ? true : false
  );

  useEffect(() => {
    setValue("permission_patient", permission_patient);
    setValue("permission_lab", permission_lab);
    setValue("permission_data", permission_data);
    setValue("permission_management", permission_management);
    setValue("permission_news", permission_news);
    setValue("permission_history", permission_history);
  }, [
    permission_patient,
    permission_lab,
    permission_data,
    permission_management,
    permission_news,
    permission_history,
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
    trigger,
    reset,
  } = useForm<RoleCreateFormData>({
    reValidateMode: "onChange",
    resolver: useYupValidationResolver(
      yup.object({
        name: yup.string().required("กรุณากรอกชื่อตำแหน่งงาน"),
      })
    ),
    values: data,
  });

  const { push, back } = useRouter();

  const { mutate: createRole } = useCreateRole();
  const { mutate: updateRole } = useUpdateRole();
  const { mutate: createLog } = useCreateLogAction();

  async function onSubmit(roleData: RoleCreateFormData) {
    if (isNaN(id)) {
      createRole(roleData, {
        onSuccess: () => {
          createLog({ action: "เพิ่มข้อมูลสิทธิ์" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.MANAGEMENT.ROLE}`);
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
      const updateRoleData: RoleUpdateForm = {
        id: id,
        ...roleData,
      };

      updateRole(updateRoleData, {
        onSuccess: () => {
          createLog({ action: "แก้ไขข้อมูลสิทธิ์" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.MANAGEMENT.ROLE}`);
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
          เพิ่มผู้ใช้งาน
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center px-3 py-10 md:px-20 md:py-20 lg:px-40 xl:px-80"
      >
        <div className="mb-6 grid w-full grid-cols-2  gap-3 rounded-xl p-10 shadow-md shadow-gray">
          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="name" value={`ตำแหน่ง`} />
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
                <p className=" text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="col-span-2 block">
            <Label htmlFor="permission" value={`สิทธิ์การเข้าถึง`} />
          </div>

          <div className="col-span-2">
            <div className="flex flex-row items-center gap-4">
              <Checkbox
                checked={permission_patient}
                onChange={() => {
                  setpermission_patient(!permission_patient);
                }}
              />
              <p>ข้อมูลรับบริการ</p>
            </div>

            <div className="flex flex-row items-center gap-4">
              <Checkbox
                checked={permission_lab}
                onChange={() => {
                  setpermission_lab(!permission_lab);
                }}
              />
              <p>การจัดเก็บข้อมูลห้องปฏิบัติการ</p>
            </div>

            <div className="flex flex-row items-center gap-4">
              <Checkbox
                checked={permission_data}
                onChange={() => {
                  setpermission_data(!permission_data);
                }}
              />
              <p>การจัดการและค้นหาข้อมูล</p>
            </div>

            <div className="flex flex-row items-center gap-4">
              <Checkbox
                checked={permission_management}
                onChange={() => {
                  setpermission_management(!permission_management);
                }}
              />
              <p>ระบบบริหารจัดการ</p>
            </div>

            <div className="flex flex-row items-center gap-4">
              <Checkbox
                checked={permission_news}
                onChange={() => {
                  setpermission_news(!permission_news);
                }}
              />
              <p>ข่าวสารและประชาสัมพันธ์</p>
            </div>

            <div className="flex flex-row items-center gap-4">
              <Checkbox
                checked={permission_history}
                onChange={() => {
                  setpermission_history(!permission_history);
                }}
              />
              <p>ประวัติการใช้งาน</p>
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

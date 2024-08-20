import { Label, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type ForgotNewPassword = {
  idcard: string;
  newPassword: string;
  confirmPassword: string;
};

type ForgotNewPasswordProps = {
  onSubmit: (data: ForgotNewPassword) => void;
  data: ForgotNewPassword;
};

const ForgotNewPassword: React.FC<ForgotNewPasswordProps> = ({
  onSubmit,
  data,
}) => {
  const form = useForm<ForgotNewPassword>();

  const onHandleSubmit = (data: ForgotNewPassword) => {
    onSubmit(data);
  };

  useEffect(() => {
    form.setValue("idcard", data.idcard);
  }, [data.idcard]);

  return (
    <div className="flex flex-col">
      <div className="p-8">
        <h1 className="text-center text-primary">กำหนดรหัสผ่านใหม่</h1>
        <div className="h-1 bg-[#238c00] opacity-50" />
        <div className="mt-2 flex flex-col gap-4">
          <div>
            <div className="block">
              <Label
                htmlFor="idcard"
                value={`รหัสผู้ใช้งาน (เลขบัตรประจำตัวประชาชน 13 หลัก)`}
              />
            </div>
            <Controller
              render={({ field }) => (
                <TextInput
                  id="idcard"
                  type="number"
                  required
                  {...field}
                  value={field.value}
                />
              )}
              name="idcard"
              control={form.control}
            />
          </div>
          <div>
            <div className="block">
              <Label htmlFor="newPassword" value={"รหัสผ่านใหม่"} />
            </div>
            <Controller
              render={({ field }) => (
                <TextInput
                  id="newPassword"
                  type="password"
                  required
                  {...field}
                  value={field.value}
                />
              )}
              name="newPassword"
              control={form.control}
            />
          </div>
          <div>
            <div className="block">
              <Label htmlFor="confirmPassword" value={"ยืนยันรหัสผ่านใหม่"} />
            </div>
            <Controller
              render={({ field }) => (
                <TextInput
                  id="confirmPassword"
                  type="password"
                  required
                  {...field}
                  value={field.value}
                />
              )}
              name="confirmPassword"
              control={form.control}
            />
          </div>
          <div>
            <button
              className="w-full"
              onClick={() => {
                form.handleSubmit(onHandleSubmit);
              }}
            >
              ดำเนินการต่อ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ForgotNewPassword };

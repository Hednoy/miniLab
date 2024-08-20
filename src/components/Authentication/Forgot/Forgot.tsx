import { Label, TextInput } from "flowbite-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type ForgotForm = {
  idcard: string;
  telephone: string;
};

type ForgotProps = {
  onSubmit: (data: ForgotForm) => void;
  data: ForgotForm;
};

const Forgot: React.FC<ForgotProps> = ({ onSubmit }) => {
  const form = useForm<ForgotForm>();

  const onHandleSubmit = (data: ForgotForm) => {
    onSubmit(data);
  };

  return (
    <div className="flex flex-col">
      <div className="p-8">
        <h1 className="text-center text-primary">ลืมรหัสผ่าน</h1>
        <div className="h-1 bg-[#238c00] opacity-50" />
        <div className="bg-[#ecffe6] p-2">
          <p>
            กรุณาระบุ เลขประจำตัวประชาชน และ หมายเลขโทรศัพท์มือถือ ของท่าน
            เพื่อยืนยันตัวตน
          </p>
        </div>
        <div className="flex flex-col gap-4">
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
              <Label
                htmlFor="telephone"
                value={"หมายเลขโทรศัพท์มือถือ (10 หลัก)"}
              />
            </div>
            <Controller
              render={({ field }) => (
                <TextInput
                  id="telephone"
                  type="number"
                  required
                  {...field}
                  value={field.value}
                />
              )}
              name="telephone"
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

export { Forgot };

import React, { FC, useEffect, useState } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import Combobox from "@/components/Combobox";

type Option = {
  value: string;
  label: string;
};

type AdministratorRegisterForm = {
  username: string;
  password: string;
  confirmPassword: string;
  prefixName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  organization: string;
  isActive: boolean;
  roleType: string;
};

type AdministratorRegisterFormProps = {
  onSubmit: (data: AdministratorRegisterForm) => void;
  onSearch: (data: AdministratorRegisterForm) => void;
  data: AdministratorRegisterForm;
};

const AdministratorRegisterForm: FC<AdministratorRegisterFormProps> = ({
  onSubmit,
  onSearch,
  data,
}) => {
  const form = useForm<AdministratorRegisterForm>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      prefixName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      organization: "",
    },
  });

  const [role, setRole] = useState<Option[]>([
    { value: "admin", label: "ผู้ดูแลระบบ" },
    { value: "manager", label: "ผู้บริหาร" },
    { value: "staff", label: "เจ้าหน้าที่" },
    { value: "user", label: "ผู้ใช้งานทั่วไป" },
  ]);

  useEffect(() => {
    form.reset();
  }, [data]);

  return (
    <div className="service-form flex flex-col divide-y-2 rounded-b-xl border-t-2 border-t-primary bg-white px-4">
      {" "}
      <div className="flex flex-col gap-4 p-4 py-6">
        <h1>จัดการบัญชีผู้ใช้</h1>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div>
              <Label htmlFor="username">ชื่อผู้ใช้ :</Label>
            </div>
            <div>
              <TextInput
                id="username"
                placeholder="ชื่อผู้ใช้"
                {...form.register("username")}
              />
            </div>
          </div>
          <div>
            <div>
              <Label htmlFor="password" className="text-danger">
                รหัสผ่าน :
              </Label>
            </div>
            <div>
              <TextInput
                id="password"
                placeholder="ชื่อผู้ใช้"
                {...form.register("password")}
              />
            </div>
          </div>
          <div>
            <div>
              <Label htmlFor="roleType">ประเภทผู้ใช้/สิทธิ์ใช้งาน :</Label>
            </div>
            <div>
              <Controller
                name="roleType"
                control={form.control}
                render={({ field }) => (
                  <Select id="roleType" {...field}>
                    {role.map((item, index) => (
                      <option value={item.value} key={index}>
                        {item.label}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="col-span-3">
            <div>
              <Label htmlFor="organization">หน่วยงาน :</Label>
            </div>
            <div>
              <Combobox
                data={[]}
                onChange={() => {
                  //
                }}
              />
            </div>
          </div>
          <div>
            <div>
              <Label htmlFor="prefixName">คำนำหน้าชื่อ :</Label>
            </div>
            <div>
              <TextInput
                id="prefixName"
                placeholder="คำนำหน้าชื่อ"
                {...form.register("prefixName")}
              />
            </div>
          </div>
          <div>
            <div>
              <Label htmlFor="firstName">ชื่อ :</Label>
            </div>
            <div>
              <TextInput
                id="firstName"
                placeholder="ชื่อ"
                {...form.register("firstName")}
              />
            </div>
          </div>
          <div>
            <div>
              <Label htmlFor="lastName">นามสกุล :</Label>
            </div>
            <div>
              <TextInput
                id="lastName"
                placeholder="นามสกุล"
                {...form.register("lastName")}
              />
            </div>
          </div>
          <div>
            <div>
              <Label htmlFor="email">อีเมล :</Label>
            </div>
            <div>
              <TextInput
                id="email"
                placeholder="อีเมล"
                {...form.register("email")}
              />
            </div>
          </div>
          <div>
            <div>
              <Label htmlFor="phoneNumber">เบอร์โทรศัพท์ :</Label>
            </div>
            <div>
              <TextInput
                id="phoneNumber"
                placeholder="เบอร์โทรศัพท์"
                {...form.register("phoneNumber")}
              />
            </div>
          </div>
          <div>
            <div>
              <Label htmlFor="isActive">สถานะ :</Label>
            </div>
            <div>
              <Controller
                name="isActive"
                control={form.control}
                render={({ field }) => (
                  <Select
                    id="isActive"
                    onChange={(value) => {
                      field.onChange(value.target.value);
                    }}
                  >
                    <option value="true">เปิดใช้งาน</option>
                    <option value="false">ปิดใช้งาน</option>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row justify-center gap-4 text-center">
          <Button
            type="button"
            onClick={() => {
              onSearch(form.getValues());
            }}
          >
            ค้นหาข้อมูล
          </Button>
          <Button
            type="submit"
            onClick={() => {
              form.handleSubmit(onSubmit);
            }}
          >
            บันทึก
          </Button>
          <Button
            type="reset"
            onClick={() => {
              form.reset();
            }}
          >
            ยกเลิก
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdministratorRegisterForm;

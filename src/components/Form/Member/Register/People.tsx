import React, { FC, useEffect } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useYupValidationResolver } from "@/components/hooks";

type Option = {
  value: string;
  label: string;
};

type PeopleRegisterForm = {
  citizen_id: string;
  mobile_phone: string;
  password: string;
  title_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  adddress: string;
  province: string;
  aumphur: string;
  tambon: string;
  zipcode: string;
  telephone: string;
  phone: string;
  fax: string;
};

const validate: yup.ObjectSchema<PeopleRegisterForm> = yup.object({
  citizen_id: yup.string().required("กรุณากรอกเลขประจำตัวประชาชน"),
  mobile_phone: yup.string().required("กรุณากรอกเบอร์มือถือ"),
  password: yup.string().required("กรุณากรอกรหัสผ่าน"),
  title_name: yup.string().required("กรุณากรอกคำนำหน้าชื่อ"),
  first_name: yup.string().required("กรุณากรอกชื่อ"),
  last_name: yup.string().required("กรุณากรอกนามสกุล"),
  gender: yup.string().required("กรุณากรอกเพศ"),
  email: yup.string().required("กรุณากรอกอีเมล"),
  adddress: yup.string().required("กรุณากรอกที่อยู่"),
  province: yup.string().required("กรุณากรอกจังหวัด"),
  aumphur: yup.string().required("กรุณากรอกอำเภอ"),
  tambon: yup.string().required("กรุณากรอกตำบล"),
  zipcode: yup.string().required("กรุณากรอกรหัสไปรษณีย์"),
  telephone: yup.string().required("กรุณากรอกเบอร์โทรศัพท์"),
  phone: yup.string().required("กรุณากรอกเบอร์มือถือ"),
  fax: yup.string().required("กรุณากรอกเบอร์แฟกซ์"),
});

type PeopleRegisterFormProps = {
  onSubmit: (data: PeopleRegisterForm) => void;
  onSearch: (data: PeopleRegisterForm) => void;
  data: PeopleRegisterForm;
};

const PeopleRegisterForm: FC<PeopleRegisterFormProps> = ({
  onSubmit,
  onSearch,
  data,
}) => {
  const form = useForm<PeopleRegisterForm>({
    defaultValues: {
      adddress: "",
      aumphur: "",
      citizen_id: "",
      email: "",
      fax: "",
      first_name: "",
      gender: "",
      last_name: "",
      mobile_phone: "",
      password: "",
      phone: "",
      province: "",
      tambon: "",
      telephone: "",
      title_name: "",
      zipcode: "",
    },
    resolver: useYupValidationResolver(validate),
  });

  useEffect(() => {
    form.reset();
  }, [data]);

  return (
    <div className="flex flex-col gap-4 p-4 py-6">
      <h1>People Register Form</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <div>
            <Label
              htmlFor="citizen_id"
              color={
                (Boolean(form.formState.errors?.citizen_id?.message) &&
                  "failure") ||
                undefined
              }
            >
              เลขประจำตัวประชาชน :
            </Label>
          </div>
          <div>
            <Controller
              control={form.control}
              name="citizen_id"
              render={({ field, fieldState }) => (
                <TextInput
                  id="citizen_id"
                  placeholder="เลขประจำตัวประชาชน"
                  {...field}
                  helperText={fieldState.error?.message}
                  color={
                    (Boolean(fieldState?.error?.message) && "failure") ||
                    undefined
                  }
                />
              )}
            />
          </div>
        </div>
        <div>
          <div>
            <Label
              htmlFor="password"
              color={
                (Boolean(form.formState.errors?.password?.message) &&
                  "failure") ||
                undefined
              }
            >
              รหัสผ่าน :
            </Label>
          </div>
          <div>
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <TextInput
                  id="password"
                  placeholder="รหัสผ่าน"
                  type="password"
                  {...field}
                  helperText={fieldState.error?.message}
                  color={
                    (Boolean(fieldState?.error?.message) && "failure") ||
                    undefined
                  }
                />
              )}
            />
          </div>
        </div>
        <div>
          <div>
            <Label
              htmlFor="title_name"
              color={
                (Boolean(form.formState.errors?.title_name?.message) &&
                  "failure") ||
                undefined
              }
            >
              คำนำหน้าชื่อ :
            </Label>
          </div>
          <div>
            <Controller
              control={form.control}
              name="title_name"
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
                  <option value="นาย">นาย</option>
                  <option value="นางสาว">นางสาว</option>
                  <option value="นาง">นาง</option>
                </Select>
              )}
            />
          </div>
        </div>
        <div>
          <div>
            <Label
              htmlFor="first_name"
              color={
                (Boolean(form.formState.errors?.first_name?.message) &&
                  "failure") ||
                undefined
              }
            >
              ชื่อ :
            </Label>
          </div>
          <div>
            <Controller
              control={form.control}
              name="first_name"
              render={({ field, fieldState }) => (
                <TextInput
                  id="first_name"
                  placeholder="ชื่อ"
                  {...field}
                  helperText={fieldState.error?.message}
                  color={
                    (Boolean(fieldState?.error?.message) && "failure") ||
                    undefined
                  }
                />
              )}
            />
          </div>
        </div>
        <div>
          <div>
            <Label
              htmlFor="last_name"
              color={
                (Boolean(form.formState.errors?.last_name?.message) &&
                  "failure") ||
                undefined
              }
            >
              นามสกุล :
            </Label>
          </div>
          <div>
            <Controller
              control={form.control}
              name="last_name"
              render={({ field, fieldState }) => (
                <TextInput
                  id="last_name"
                  placeholder="นามสกุล"
                  {...field}
                  helperText={fieldState.error?.message}
                  color={
                    (Boolean(fieldState?.error?.message) && "failure") ||
                    undefined
                  }
                />
              )}
            />
          </div>
        </div>
        <div>
          <div>
            {/* <Label htmlFor="gender">เพศ :</Label> */}
            <Label
              htmlFor="gender"
              color={
                (Boolean(form.formState.errors?.gender?.message) &&
                  "failure") ||
                undefined
              }
            >
              เพศ :
            </Label>
          </div>
          <div>
            <Controller
              control={form.control}
              name="gender"
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
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                </Select>
              )}
            />
          </div>
        </div>
        <div>
          <div>
            <Label
              htmlFor="email"
              color={
                (Boolean(form.formState.errors?.email?.message) && "failure") ||
                undefined
              }
            >
              อีเมล :
            </Label>
          </div>
          <div>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <TextInput
                  id="email"
                  placeholder="อีเมล"
                  {...field}
                  helperText={fieldState.error?.message}
                  color={
                    (Boolean(fieldState?.error?.message) && "failure") ||
                    undefined
                  }
                />
              )}
            />
          </div>
        </div>
        <div>
          <div>
            <Label
              htmlFor="phone"
              color={
                (Boolean(form.formState.errors?.phone?.message) && "failure") ||
                undefined
              }
            >
              เบอร์โทรศัพท์ :
            </Label>
          </div>
          <div>
            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <TextInput
                  id="phone"
                  placeholder="เบอร์โทรศัพท์"
                  {...field}
                  helperText={fieldState.error?.message}
                  color={
                    (Boolean(fieldState?.error?.message) && "failure") ||
                    undefined
                  }
                />
              )}
            />
          </div>
        </div>
        <div>
          <div>
            <Label
              htmlFor="mobile_phone"
              color={
                (Boolean(form.formState.errors?.mobile_phone?.message) &&
                  "failure") ||
                undefined
              }
            >
              เบอร์มือถือ :
            </Label>
          </div>
          <div>
            <Controller
              control={form.control}
              name="mobile_phone"
              render={({ field, fieldState }) => (
                <TextInput
                  id="mobile_phone"
                  placeholder="เบอร์มือถือ"
                  {...field}
                  helperText={fieldState.error?.message}
                  color={
                    (Boolean(fieldState?.error?.message) && "failure") ||
                    undefined
                  }
                />
              )}
            />
          </div>
        </div>
        <div>
          <div>
            <Label
              htmlFor="fax"
              color={
                (Boolean(form.formState.errors?.fax?.message) && "failure") ||
                undefined
              }
            >
              เบอร์แฟกซ์ :
            </Label>
          </div>
          <div>
            <Controller
              control={form.control}
              name="fax"
              render={({ field, fieldState }) => (
                <TextInput
                  id="fax"
                  placeholder="เบอร์แฟกซ์"
                  {...field}
                  helperText={fieldState.error?.message}
                  color={
                    (Boolean(fieldState?.error?.message) && "failure") ||
                    undefined
                  }
                />
              )}
            />
          </div>
        </div>
        {/* <FormProvider {...form}><Address /></FormProvider> */}
      </div>
      <div className="flex flex-row gap-4">
        <Button
          type="button"
          onClick={() => {
            onSearch(form.getValues());
          }}
        >
          ค้นหาข้อมูล
        </Button>
        <Button
          type="button"
          onClick={() => {
            form.handleSubmit(onSubmit)();
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
  );
};

export default PeopleRegisterForm;

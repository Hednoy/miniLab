import React, { useEffect, useState } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import { BsChevronRight } from "react-icons/bs";
import Image from "next/image";
import DeleteModal from "../Table/DeleteModal";
import { Dialog } from "../Dialog";
import { useRouter } from "next/navigation";

type SignupForm = {
  citizen_id: string;
  mobile_phone: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  department: string;
};

type SignupProps = {
  onSubmit: (data: SignupForm) => void;
  data: SignupForm;
  onClickHome?: () => void;
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
};

const Signup: React.FC<SignupProps> = ({
  data,
  onSubmit,
  onClickHome,
  currentStep,
  setCurrentStep,
}) => {
  const {
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<SignupForm>();

  const router = useRouter();
  const [userType, setUserType] = useState("0");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);

  const onChangeCitizen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = new RegExp("^[0-9]*$");
    if (!regex.test(e.target.value)) {
      setError("citizen_id", {
        type: "manual",
        message: "รหัสผู้ใช้งานควรเป็นตัวเลขเท่านั้น",
      });
    } else if (e.target.value.length > 13) {
      setError("citizen_id", {
        type: "manual",
        message: "รหัสผู้ใช้งานไม่ถูกต้อง",
      });
    } else {
      setCitizenId(e.target.value);
      setError("citizen_id", {});
    }
  };

  const onHandleSubmit = () => {
    onSubmit(data);
    setIsOpenSuccess(true);
  };

  const onErrors = (e: any) => {
    console.error("error : ", e);
  };

  useEffect(() => {
    reset(data);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center md:px-[120px]">
      <div className="flex min-h-[640px] w-full flex-col items-center rounded-[20px] bg-white  p-10">
        <Image
          src={"/images/ddc-logo.png"}
          alt="ddc-logo"
          width={160}
          height={160}
        />
        <h1 className="py-3 font-medium text-primary xl:py-6">
          ลงทะเบียน
          {currentStep != 1 &&
            (userType == "1"
              ? "ผู้ใช้งานทั่วไป"
              : userType == "2"
                ? "เจ้าหน้าที่ปฎิบัติการ"
                : userType == "3"
                  ? "ผู้ดูแลระบบ"
                  : "")}
        </h1>
        <div className="w-full md:px-20 xl:px-[360px]">
          <div className={`${currentStep != 1 ? "hidden" : ""}`}>
            <div className={`flex-1`}>
              <div>
                <Label htmlFor="user_type" value="ประเภทผู้ใช้งาน" />
              </div>
              <Select
                value={userType}
                onChange={(e) => {
                  setUserType(e.currentTarget.value);
                }}
              >
                <option value={"0"}>กรุณาเลือกประเภทผู้ใช้งาน</option>
                <option value={"1"}>ผู้ใช้งานทั่วไป</option>
                <option value={"2"}>เจ้าหน้าที่ปฎิบัติการ</option>
                <option value={"3"}>ผู้ดูแลระบบ</option>
              </Select>
            </div>
            <button
              className={
                "mb-6 mt-8 h-10 w-full rounded-[5px] bg-primary p-1 text-[18px] font-semibold text-white"
              }
              disabled={userType == "0"}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              ถัดไป
            </button>
          </div>

          <div className={`${currentStep != 2 ? "hidden" : ""}`}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="block">
                  <Label htmlFor="first_name" value={`ชื่อ`} />
                </div>
                <Controller
                  render={({ field }) => (
                    <TextInput
                      id="first_name"
                      type="text"
                      required
                      {...field}
                      value={firstName}
                      onFocus={() => {
                        setError("first_name", {});
                        setError("root", {});
                      }}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  )}
                  name="first_name"
                  control={control}
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
                  render={({ field }) => (
                    <TextInput
                      id="last_name"
                      type="text"
                      required
                      {...field}
                      value={lastName}
                      onFocus={() => {
                        setError("last_name", {});
                        setError("root", {});
                      }}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  )}
                  name="last_name"
                  control={control}
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
                  render={({ field }) => (
                    <TextInput
                      id="citizen_id"
                      type="text"
                      required
                      {...field}
                      value={citizenId}
                      onFocus={() => {
                        setError("citizen_id", {});
                        setError("root", {});
                      }}
                      onChange={onChangeCitizen}
                    />
                  )}
                  name="citizen_id"
                  control={control}
                />
                <div className="text-start">
                  {errors.citizen_id && (
                    <p className=" text-red-500">{errors.citizen_id.message}</p>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <div className="block">
                  <Label htmlFor="mobile_phone" value={`หมายเลขโทรศัพท์`} />
                </div>
                <Controller
                  render={({ field }) => (
                    <TextInput
                      id="mobile_phone"
                      type="text"
                      required
                      {...field}
                      value={mobilePhone}
                      onFocus={() => {
                        setError("mobile_phone", {});
                        setError("root", {});
                      }}
                      onChange={(e) => setMobilePhone(e.target.value)}
                    />
                  )}
                  name="mobile_phone"
                  control={control}
                />
                <div className="text-start">
                  {errors.mobile_phone && (
                    <p className=" text-red-500">
                      {errors.mobile_phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="block">
                  <Label htmlFor="mobile_phone" value={`ตำแหน่งงาน`} />
                </div>
                <Controller
                  render={({ field }) => (
                    <TextInput
                      id="mobile_phone"
                      type="text"
                      required
                      {...field}
                      value={mobilePhone}
                      onFocus={() => {
                        setError("mobile_phone", {});
                        setError("root", {});
                      }}
                      onChange={(e) => setMobilePhone(e.target.value)}
                    />
                  )}
                  name="mobile_phone"
                  control={control}
                />
                <div className="text-start">
                  {errors.mobile_phone && (
                    <p className=" text-red-500">
                      {errors.mobile_phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="block">
                  <Label htmlFor="mobile_phone" value={`แผนก`} />
                </div>
                <Controller
                  render={({ field }) => (
                    <TextInput
                      id="mobile_phone"
                      type="text"
                      required
                      {...field}
                      value={mobilePhone}
                      onFocus={() => {
                        setError("mobile_phone", {});
                        setError("root", {});
                      }}
                      onChange={(e) => setMobilePhone(e.target.value)}
                    />
                  )}
                  name="mobile_phone"
                  control={control}
                />
                <div className="text-start">
                  {errors.mobile_phone && (
                    <p className=" text-red-500">
                      {errors.mobile_phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="block">
                  <Label htmlFor="mobile_phone" value={`อีเมล`} />
                </div>
                <Controller
                  render={({ field }) => (
                    <TextInput
                      id="mobile_phone"
                      type="text"
                      required
                      {...field}
                      value={mobilePhone}
                      onFocus={() => {
                        setError("mobile_phone", {});
                        setError("root", {});
                      }}
                      onChange={(e) => setMobilePhone(e.target.value)}
                    />
                  )}
                  name="mobile_phone"
                  control={control}
                />
                <div className="text-start">
                  {errors.mobile_phone && (
                    <p className=" text-red-500">
                      {errors.mobile_phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="block">
                  <Label htmlFor="mobile_phone" value={`รหัสผ่าน`} />
                </div>
                <Controller
                  render={({ field }) => (
                    <TextInput
                      id="mobile_phone"
                      type="text"
                      required
                      {...field}
                      value={mobilePhone}
                      onFocus={() => {
                        setError("mobile_phone", {});
                        setError("root", {});
                      }}
                      onChange={(e) => setMobilePhone(e.target.value)}
                    />
                  )}
                  name="mobile_phone"
                  control={control}
                />
                <div className="text-start">
                  {errors.mobile_phone && (
                    <p className=" text-red-500">
                      {errors.mobile_phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-2 mt-16 grid grid-cols-2 gap-3">
                <button
                  className={
                    "mb-6 h-10 w-full rounded-[5px] bg-primary-pink p-1 text-[18px] font-semibold text-white"
                  }
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                  }}
                >
                  ย้อนกลับ
                </button>
                <button
                  className={
                    "mb-6 h-10 w-full rounded-[5px] bg-primary p-1 text-[18px] font-semibold text-white"
                  }
                  onClick={() => onHandleSubmit()}
                >
                  ลงทะเบียน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        title={"ลงทะเบียนสำเร็จ!"}
        description={"กรุณาเข้าสู่ระบบด้วยอีเมลที่ลงทะเบียนเพื่อใช้งาน"}
        isOpen={isOpenSuccess}
        onClose={() => setIsOpenSuccess(false)}
        onSubmit={() => {
          setIsOpenSuccess(false);
          router.push("/auth/loginAgent");
        }}
        status={"success"}
        confirmText={"เข้าสู่ระบบ"}
      />
    </div>
    // <div className="flex flex-col divide-y-2">
    //   <div className="py-6">
    //     <div className="flex w-fit flex-row items-center gap-2">
    //       <p>
    //         <a className="text-[#1abc9c]" onClick={onClickHome}>
    //           หน้าหลัก
    //         </a>
    //         <BsChevronRight className="inline-block" />
    //         <a className="text-[#1abc9c]" onClick={onClickAgree}>
    //           ข้อตกลง
    //         </a>
    //         <BsChevronRight className="inline-block" />
    //         <span>ลงทะเบียน</span>
    //       </p>
    //     </div>
    //   </div>
    //   <div className="gap-2 divide-y-2">
    //     <div className="py-6">
    //       <div className="mb-2 flex flex-row">
    //         <div className="border-b-2 border-primary px-8">
    //           <h1 className="text-primary">ลงทะเบียน</h1>
    //         </div>
    //       </div>
    //       <div className="flex flex-row gap-2">
    //         <div className="flex-1">
    //           <div>
    //             <Label
    //               htmlFor="citizen_id"
    //               value="เลขประจำตัวประชาชน (13 หลัก)"
    //             />
    //             <span className="ml-2 text-danger">
    //               ใช้เป็น Username สำหรับเข้าสู่ระบบ
    //             </span>
    //           </div>
    //           <TextInput
    //             id="citizen_id"
    //             type="number"
    //             required
    //             {...register("citizen_id")}
    //           />
    //         </div>
    //         <div className="flex-1">
    //           <div>
    //             <Label
    //               htmlFor="mobile_phone"
    //               value="หมายเลขโทรศัพท์มือถือ (10 หลัก)"
    //             />
    //           </div>
    //           <TextInput
    //             id="mobile_phone"
    //             type="number"
    //             required
    //             {...register("mobile_phone")}
    //           />
    //         </div>
    //       </div>

    //       <div className="flex flex-row gap-2">
    //         <div className="flex-1">
    //           <div>
    //             <Label htmlFor="password" value="รหัสผ่าน" />
    //           </div>
    //           <TextInput
    //             id="password"
    //             type="password"
    //             required
    //             {...register("password")}
    //           />
    //         </div>
    //         <div className="flex-1">
    //           <div>
    //             <Label htmlFor="confirm_password" value="ยืนยันรหัสผ่าน" />
    //           </div>
    //           <TextInput
    //             id="confirm_password"
    //             type="password"
    //             required
    //             {...register("confirm_password")}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //     <div className="py-6">
    //       <div className="mb-2 flex flex-row">
    //         <div className="border-b-2 border-primary px-8">
    //           <h1 className="text-primary">ข้อมูลส่วนตัว</h1>
    //         </div>
    //       </div>
    //       <div className="flex flex-row gap-2">
    //         <div className="flex-1">
    //           <div>
    //             <Label htmlFor="title_name" value="คำนำหน้าชื่อ" />
    //           </div>
    //           <TextInput
    //             id="title_name"
    //             type="text"
    //             required
    //             {...register("title_name")}
    //           />
    //         </div>
    //         <div className="flex-1">
    //           <div>
    //             <Label htmlFor="first_name" value="ชื่อ" />
    //           </div>
    //           <TextInput
    //             id="first_name"
    //             type="text"
    //             required
    //             {...register("first_name")}
    //           />
    //         </div>
    //         <div className="flex-1">
    //           <div>
    //             <Label htmlFor="last_name" value="นามสกุล" />
    //           </div>
    //           <TextInput
    //             id="last_name"
    //             type="text"
    //             required
    //             {...register("last_name")}
    //           />
    //         </div>
    //         {/* gender */}
    //         <div className="flex-1">
    //           <div>
    //             <Label htmlFor="gender" value="เพศ" />
    //           </div>
    //           <Select>
    //             <option value="ชาย">ชาย</option>
    //             <option value="หญิง">หญิง</option>
    //           </Select>
    //         </div>
    //       </div>
    //       <div className="flex flex-row gap-2">
    //         <div className="flex-1">
    //           <div>
    //             <Label htmlFor="email" value="อีเมล" />
    //           </div>
    //           <TextInput
    //             id="email"
    //             type="email"
    //             required
    //             {...register("email")}
    //           />
    //         </div>
    //       </div>
    //       <div className="mt-4 flex flex-col items-center justify-center text-center text-danger">
    //         <span>
    //           หมายเหตุ ข้อมูลที่ลงทะเบียน ทางกระทรวงฯ จะเก็บไว้เป็นความลับ
    //           ตามพระราชบัญญัติคอมพิวเตอร์ พ.ศ. 2551
    //         </span>
    //         <Button
    //           className="mt-4"
    //           onClick={handleSubmit(onHandleSubmit, onErrors)}
    //         >
    //           ลงทะเบียน
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export { Signup };

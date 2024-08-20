import { Label, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import SideLine from "../assets/images/SideLogin.jpg";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { log } from "console";

type SigninForm = {
  username: string;
  password: string;
};

type SigninProps = {
  onSubmit?: (data: SigninForm) => void;
  onRegister?: () => void;
  data?: SigninForm;
  isResponseOk?: boolean;
  setIsResponseOk?: (isResponseOk: boolean) => void;
};

const Signin: React.FC<SigninProps> = ({
  data,
  onSubmit,
  isResponseOk,
  setIsResponseOk,
  onRegister,
}) => {
  const {
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<SigninForm>();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    reset(data);
    setUserName("");
    setEmail("");
    setPassword("");
  }, []);

  useEffect(() => {
    if (!isResponseOk) {
      setError("root", {
        type: "manual",
        message: "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบชื่อผู้ใช้งานและรหัสผ่าน",
      });
      setPassword("");
    }
  }, [isResponseOk]);

  const onHandleSubmit = () => {
    if (username.length == 0) {
      setError("username", {
        type: "manual",
        message: "กรุณากรอกชื่อผู้ใช้งาน",
      });
      return;
    }
    if (password.length == 0) {
      setError("password", {
        type: "manual",
        message: "กรุณากรอกรหัสผ่าน",
      });
      return;
    }
    onSubmit && onSubmit({ username: username, password: password });
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="h-full w-full max-w-screen-md overflow-y-auto rounded-[20px] bg-white md:h-3/4">
        <div className="m-auto flex h-full w-full max-w-screen-md flex-col place-content-center items-center px-2 md:px-10">
          <Image
            src={"/images/ddc-logo.svg"}
            alt="ddc-logo"
            width={230}
            height={230}
            className="my-8"
          />
          <p className="text-center text-base font-medium text-gray">
            ระบบบริหารการจัดการข้อมูลห้องปฏิบัติการ <br />
            สถาบันป้องกันควบคุมโรคเขตเมือง
          </p>
          <h1 className="py-2 font-medium text-primary md:py-5">
            ยินดีต้อนรับ
          </h1>
          <div className="w-full px-0 md:px-6 ">
            <div className="block">
              <Label htmlFor="username" value={`ชื่อผู้ใช้งาน`} />
            </div>
            <Controller
              render={({ field }) => (
                <TextInput
                  id="username"
                  type="text"
                  required
                  {...field}
                  value={username}
                  onFocus={() => {
                    setError("username", {});
                    setError("root", {});
                    setIsResponseOk && setIsResponseOk(true);
                  }}
                  onChange={(e) => setUserName(e.target.value)}
                />
              )}
              name="username"
              control={control}
            />
            <div className="text-start">
              {" "}
              {errors.username && (
                <p className=" text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="block">
              <Label htmlFor="password" value={`รหัสผ่าน`} />
            </div>
            <Controller
              render={({ field }) => (
                <TextInput
                  id="password"
                  type="password"
                  required
                  {...field}
                  value={password}
                  onFocus={() => {
                    setError("password", {});
                    setError("root", {});
                    setIsResponseOk && setIsResponseOk(true);
                  }}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
              name="password"
              control={control}
            />
            <div className="text-start">
              {errors.password && (
                <p className=" text-red-500">{errors.password.message}</p>
              )}
            </div>
            {errors.root && (
              <p className="text-red-500">{errors.root.message}</p>
            )}

            <button
              className={
                "mb-6 mt-8 h-10 w-full rounded-[5px] bg-primary p-1 text-[18px] font-semibold text-white"
              }
              onClick={() => onHandleSubmit()}
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Signin };

"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Signup } from "@/components/Authentication/Signup";

type SignupForm = {
  citizen_id: string;
  mobile_phone: string;
  password: string;
  confirm_password: string;
  title_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
};

const Users = () => {
  const { data: session } = useSession();
  const router = useRouter();

  async function onSubmit(data: SignupForm) {}
  return (
    <>
      <Signup
        onSubmit={function (data: {
          citizen_id: string;
          mobile_phone: string;
          password: string;
          first_name: string;
          last_name: string;
          email: string;
          position: string;
          department: string;
        }): void {
          throw new Error("Function not implemented.");
        }}
        data={{
          citizen_id: "",
          mobile_phone: "",
          password: "",
          first_name: "",
          last_name: "",
          email: "",
          position: "",
          department: "",
        }}
        currentStep={0}
        setCurrentStep={function (currentStep: number): void {
          throw new Error("Function not implemented.");
        }}
      />
    </>
  );
};

export default Users;

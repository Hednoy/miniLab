"use client";

import React, { useEffect, useState } from "react";
import { Signup } from "@/components/Authentication/Signup";
import { useRouter } from "next/navigation";
import { UserCreateData } from "@/types/models/User";
import { useCreateUser } from "@/lib-client/react-query/auth/useCreateUser";
import { NextPage } from "next";

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

const Register: NextPage = () => {
  const router = useRouter();
  const { mutate: createUser } = useCreateUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState("");

  async function onSubmit(data: SignupForm) {
    createUser(data as UserCreateData);
  }

  useEffect(() => {
    setUserType("1");
  }, [currentStep]);

  return (
    <Signup
      onSubmit={onSubmit}
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
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  );
};

export default Register;

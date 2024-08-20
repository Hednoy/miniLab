"use client";

import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Signin } from "@/components/Authentication/Signin";
import { useRouter } from "next/navigation";

type SigninForm = {
  username: string;
  password: string;
};

const Login = () => {
  const { data: session } = useSession();
  const [isResponseOk, setIsResponseOk] = useState(true);
  const router = useRouter();

  async function onSubmit(data: SigninForm) {
    const response = await signIn<"credentials">("credentials", {
      username: data.username,
      password: data.password,
      redirect: false, // mutation with csrf token maybe
    });
    if (response?.ok) {
      router.push("/dashboard");
    } else {
      setIsResponseOk(false);
    }
  }
  return (
    <>
      <Signin
        onSubmit={onSubmit}
        isResponseOk={isResponseOk}
        setIsResponseOk={setIsResponseOk}
        onRegister={() => {
          router.push("/auth/register");
        }}
        data={{
          username: "",
          password: "",
        }}
      />
    </>
  );
};

export default Login;

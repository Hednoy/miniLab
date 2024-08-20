"use client";

import React from "react";
import { Routes } from "@/lib-client/constants";
import { useRouter } from "next/navigation";
import { Agree } from "@/components/Authentication/Agree";
import { NextPage } from "next";

const Agreement: NextPage = () => {
  const router = useRouter();

  return (
    <Agree
      onClickHome={() => {
        router.push(Routes.SITE.HOME);
      }}
      onClickSignup={() => {
        router.push(Routes.SITE.MEMBER.REGISTER);
      }}
    />
  );
};

export default Agreement;

"use client";

import OtherTestTypeManage from "@/components/Pages/Other/TestTypeManage";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const OtherTestTypeManagePage: NextPage = () => {
  const { id }: any = useParams();

  return (
    <div className="w-full p-6">
      <OtherTestTypeManage id={Number(id)} />
    </div>
  );
};

export default OtherTestTypeManagePage;

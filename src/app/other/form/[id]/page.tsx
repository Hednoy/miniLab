"use client";

import OtherFormManage from "@/components/Pages/Other/FormManage";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const OtherFormManagePage: NextPage = () => {
  const { id }: any = useParams();

  return (
    <div className="container flex flex-col gap-6 p-4">
      <OtherFormManage id={Number(id)} />
    </div>
  );
};

export default OtherFormManagePage;

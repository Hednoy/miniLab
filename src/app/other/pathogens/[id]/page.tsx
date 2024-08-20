"use client";

import OtherPathogensManage from "@/components/Pages/Other/PathogensManage ";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const OtherPathogensManagePage: NextPage = () => {
  const { id }: any = useParams();

  return (
    <div className="w-full p-6">
      <OtherPathogensManage id={Number(id)} />
    </div>
  );
};

export default OtherPathogensManagePage;

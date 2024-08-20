"use client";

import OtherHospitalManage from "@/components/Pages/Other/HospitalManage";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const OtherHospitalManagePage: NextPage = () => {
  const { id }: any = useParams();

  return (
    <div className="w-full p-6">
      <OtherHospitalManage id={Number(id)} />
    </div>
  );
};

export default OtherHospitalManagePage;

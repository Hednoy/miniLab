"use client";

import OtherInspectionTypeManage from "@/components/Pages/Other/InspectionTypeManage";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const OtherInspectionTypeManagePage: NextPage = () => {
  const { id }: any = useParams();

  return (
    <div className="w-full p-6">
      <OtherInspectionTypeManage id={Number(id)} />
    </div>
  );
};

export default OtherInspectionTypeManagePage;

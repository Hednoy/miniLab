"use client";

import PatientManage from "@/components/Pages/Patient/PatientManage";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const PatientManagePage: NextPage = () => {
  const { id }: any = useParams();

  return (
    <div className="w-full p-6">
      <PatientManage id={Number(id)} />
    </div>
  );
};

export default PatientManagePage;

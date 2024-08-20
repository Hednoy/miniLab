"use client";

import ManagementOfficerManage from "@/components/Pages/Management/ManagementOfficerManage";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const ManagementOfficerManagePage: NextPage = () => {
  const { id }: any = useParams();

  return (
    <div className="w-full p-6">
      <ManagementOfficerManage id={Number(id)} />
    </div>
  );
};

export default ManagementOfficerManagePage;

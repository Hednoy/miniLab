"use client";

import ManagementRoleManage from "@/components/Pages/Management/ManagementRoleManage";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const ManagementRoleManagePage: NextPage = () => {
  const { id }: any = useParams();

  return (
    <div className="w-full p-6">
      <ManagementRoleManage id={Number(id)} />
    </div>
  );
};

export default ManagementRoleManagePage;

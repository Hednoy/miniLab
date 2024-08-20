"use client";

import ManagementRole from "@/components/Pages/Management/ManagementRole";
import { NextPage } from "next";
import React from "react";

const ManagementRolesPage: NextPage = () => {
  return (
    <div className="w-full p-6">
      <ManagementRole />
    </div>
  );
};

export default ManagementRolesPage;

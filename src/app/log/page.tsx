"use client";

import ManagementLogs from "@/components/Pages/Management/ManagementLogs";
import { NextPage } from "next";
import React from "react";

const ManagementLogsPage: NextPage = () => {
  return (
    <div className="w-full p-6">
      <ManagementLogs />
    </div>
  );
};

export default ManagementLogsPage;

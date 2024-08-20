"use client";

import DashboardView from "@/components/Pages/Dashboard/DashboardView";
import { NextPage } from "next";
import React from "react";

const DashboardViewPage: NextPage = () => {
  return (
    <div className="w-full p-6">
      <DashboardView />
    </div>
  );
};

export default DashboardViewPage;

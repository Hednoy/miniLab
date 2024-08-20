"use client";

import DashboardPathogens from "@/components/Pages/DashboardPathogens/DashboardPathogens";
import { NextPage } from "next";
import React from "react";

const DashboardPage: NextPage = () => {
  return (
    <div className="w-full p-6">
      <DashboardPathogens />
    </div>
  );
};

export default DashboardPage;

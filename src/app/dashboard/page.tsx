"use client";

import Dashboard from "@/components/Pages/Dashboard/Dashboard";
import { NextPage } from "next";
import React from "react";

const DashboardPage: NextPage = () => {
  return (
    <div className="w-full p-6">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;

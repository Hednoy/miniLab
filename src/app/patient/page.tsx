"use client";

import Patient from "@/components/Pages/Patient/Patient";
import { NextPage } from "next";
import React from "react";

const PatientPage: NextPage = () => {
  return (
    <div className="w-full p-6">
      <Patient />
    </div>
  );
};

export default PatientPage;

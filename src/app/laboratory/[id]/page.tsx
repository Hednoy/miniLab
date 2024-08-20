"use client";

import LaboratoryManage from "@/components/Pages/Laboratory/LaboratoryManage";
import { NextPage } from "next";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const LaboratoryManagePage: NextPage = () => {
  const { id }: any = useParams();
  const searchParams = useSearchParams();
  const state = searchParams?.get("state");
  return (
    <div className="w-full p-6">
      <LaboratoryManage
        id={Number(id)}
        state={state == "view" ? true : false}
      />
    </div>
  );
};

export default LaboratoryManagePage;

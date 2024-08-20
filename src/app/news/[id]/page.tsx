"use client";

import NewsManage from "@/components/Pages/News/NewsManage";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const NewsManagePage: NextPage = () => {
  const { id }: any = useParams();

  return (
    <div className="w-full p-6">
      <NewsManage id={Number(id)} />
    </div>
  );
};

export default NewsManagePage;

"use client";

import NewsDetail from "@/components/Pages/News/NewDetail";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import React from "react";

const NewsDetailPage: NextPage = () => {
  const { id }: any = useParams();

  return (
    <div className="w-full p-6">
      <NewsDetail id={Number(id)} />
    </div>
  );
};

export default NewsDetailPage;

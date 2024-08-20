"use client";

import News from "@/components/Pages/News/News";
import { NextPage } from "next";
import React from "react";

const NewsPage: NextPage = () => {
  return (
    <div className="w-full p-6">
      <News />
    </div>
  );
};

export default NewsPage;

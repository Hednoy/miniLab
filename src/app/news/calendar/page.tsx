"use client";

import NewsCalendar from "@/components/Pages/News/NewsCalendar";
import { NextPage } from "next";
import React from "react";

const NewsCalendarPage: NextPage = () => {
  return (
    <div className="w-full p-6">
      <NewsCalendar />
    </div>
  );
};

export default NewsCalendarPage;

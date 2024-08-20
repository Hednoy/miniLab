"use client";

import SearchInformation from "@/components/Pages/SearchInformation/SearchInformation";
import { NextPage } from "next";
import React from "react";

const SearchInformationPage: NextPage = () => {
  return (
    <div className="w-full p-6">
      <SearchInformation />
    </div>
  );
};

export default SearchInformationPage;

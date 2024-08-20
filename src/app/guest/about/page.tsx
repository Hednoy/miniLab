"use client";

import { About } from "@/components";
import { NextPage } from "next";

const AboutPage: NextPage = () => {
  return (
    <main>
      <div className="mx-auto max-w-screen-xl">
        <About />
      </div>
    </main>
  );
};

export default AboutPage;

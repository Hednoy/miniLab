"use client";

import { Faq } from "@/components";
import { NextPage } from "next";

const FaqPage: NextPage = () => {
  return (
    <main>
      <div className="mx-auto mb-10 max-w-screen-xl">
        <Faq data={[{ answer: "คำตอบ 1", question: "ตั้งคำถาม 1" }]} />
      </div>
    </main>
  );
};

export default FaqPage;

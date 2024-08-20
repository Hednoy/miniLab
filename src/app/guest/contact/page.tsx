"use client";

import { Contact } from "@/components";
import { NextPage } from "next";

const ContactPage: NextPage = () => {
  return (
    <main>
      <div className="mx-auto mb-10 max-w-screen-xl">
        <Contact />
      </div>
    </main>
  );
};

export default ContactPage;

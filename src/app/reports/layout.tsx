"use client";
import type { Metadata } from "next";
import { Flowbite } from "flowbite-react";
import AppWrapper from "../AppWrapper";
import "../globals.css";

import flowbiteTheme from "../flowbiteTheme";
const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <AppWrapper>
      <Flowbite theme={{ theme: flowbiteTheme }}>
        <div className="mx-auto max-w-screen-xl">{children}</div>
      </Flowbite>
    </AppWrapper>
  );
};

export default RootLayout;

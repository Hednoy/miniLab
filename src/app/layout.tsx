import { Flowbite } from "flowbite-react";
import "./globals.css";
import { NextAuthProvider } from "./providers";
import flowbiteTheme from "./flowbiteTheme";
import { Metadata } from "next";
import MainLayout from "@/layout/MainLayout/MainLayout";
import { prompt } from "./assets/fonts";
import "../styles/antd.scss";

export const metadata: Metadata = {
  title: "สถาบันป้องกันควบคุมโรคเขตเมือง",
  description: "สถาบันป้องกันควบคุมโรคเขตเมือง",
};

function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className={prompt.variable}>
      <body>
        <Flowbite theme={{ theme: flowbiteTheme }}>
          <NextAuthProvider>
            <MainLayout>{children}</MainLayout>
          </NextAuthProvider>
        </Flowbite>
      </body>
    </html>
  );
}

export default RootLayout;

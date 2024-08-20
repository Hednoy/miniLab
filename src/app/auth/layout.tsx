"use client";

import { Footer, NavigatorTop } from "@/components";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AppWrapper from "../AppWrapper";

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("pathname", pathname);
  }, [pathname]);
  return (
    <AppWrapper>
      <div className="h-screen w-screen bg-[url('/images/bg-image.jpg')] bg-cover">
        {children}
      </div>
    </AppWrapper>
  );
};

export default RootLayout;

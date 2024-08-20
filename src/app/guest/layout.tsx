"use client";

import { Footer, NavigatorTop } from "@/components";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <main>
      <NavigatorTop
        active={pathname || "/"}
        onMenuClick={(link) => {
          push(link);
        }}
      />
      {children}
      <Footer />
    </main>
  );
};

export default RootLayout;

"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  useEffect(() => {
    // Load the script to clear cookies on browser close
    const script = document.createElement("script");
    script.src = "/clearCookies.js";
    script.async = true;
    document.body.appendChild(script);
    // Cleanup function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
};

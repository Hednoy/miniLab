"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import getQueryClientConfig from "@/lib-client/react-query/queryClientConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AppWrapperProps {
  children: ReactNode;
}

const queryClient = new QueryClient(getQueryClientConfig());

const AppWrapper: React.FC<AppWrapperProps> = ({ children }: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </QueryClientProvider>
  );
};

export default AppWrapper;

"use client";
import AppWrapper from "@/app/AppWrapper";
import { SideBar } from "@/components";
import { Routes } from "@/lib-client/constants";
import { faBars, faBurger, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

const MainLayout: FC<Props> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const { data: session, status } = useSession();
  const { push, replace } = useRouter();
  const pathname = usePathname();

  if (status === "unauthenticated" && !pathname?.startsWith("/auth")) {
    push(Routes.SITE.LOGIN);
  }

  const handleLogoutClick = () => {
    signOut({ callbackUrl: Routes.SITE.LOGIN });
  };

  if (pathname?.startsWith("/auth")) return <>{children}</>;
  else
    return (
      <AppWrapper>
        <div className="flex flex-col bg-white">
          <div className="grid w-full  grid-cols-3 bg-white px-3 md:hidden">
            <button type="button" className="h-10 w-10 self-center">
              <FontAwesomeIcon
                icon={!collapsed ? faBars : faXmark}
                className="h-8 w-8 text-primary"
                onClick={() => setCollapsed(!collapsed)}
              />
            </button>
            <img
              src="/images/ddc-logo.svg"
              alt="ddc-logo"
              width={150}
              height={150}
              className="object-fill py-5"
            />
          </div>
          <div className="flex w-full">
            <div
              className={`z-10 h-screen shadow-md ${
                collapsed ? "fixed block" : "sticky hidden md:top-0 md:block"
              }`}
            >
              <SideBar
                page={pathname ?? ""}
                permission={{
                  data: session?.user?.permission_data ?? false,
                  history: session?.user?.permission_history ?? false,
                  lab: session?.user?.permission_lab ?? false,
                  management: session?.user?.permission_management ?? false,
                  news: session?.user?.permission_news ?? false,
                  patient: session?.user?.permission_patient ?? false,
                }}
                role={session?.user?.is_admin ? "admin" : "officer"}
                name={session?.user?.name ?? ""}
                onNavigate={(u) => {
                  push(u);
                }}
                txtRole={session?.user?.role ?? ""}
                collapsed={collapsed}
                logout={handleLogoutClick}
              />
            </div>
            <div className="max-h-screen w-full overflow-y-auto">
              {status === "loading" ? (
                <div className="flex h-screen flex-col items-center justify-center">
                  <div className="m-auto">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="text-gray-200 dark:text-gray-600 inline h-8 w-8 animate-spin fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>{children}</>
              )}
            </div>
          </div>
        </div>
      </AppWrapper>
    );
};

export default MainLayout;

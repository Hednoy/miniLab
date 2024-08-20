"use client";

import { useCreateLogAction } from "@/lib-client/react-query/log";
import { Sidebar as FBSidebar } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";

type Permission = {
  data: boolean;
  history: boolean;
  lab: boolean;
  management: boolean;
  news: boolean;
  patient: boolean;
};

type SidebarProps = {
  page: string;
  name?: string;
  txtRole?: string;
  role: "officer" | "admin";
  permission: Permission;
  collapsed?: boolean;
  onNavigate?: (uri: string) => void;
  logout?: () => void;
};

const Sidebar: FC<SidebarProps> = ({
  page,
  onNavigate,
  collapsed = false,
  role = "officer",
  permission,
  logout,
}) => {
  const [currentPage, setCurrentPage] = useState(page);

  const UserMenus = [
    {
      title: "Dashboard",
      path: "/dashboard",
      submenu: [
        { title: "Main", path: "/dashboard" },
        { title: "Pathogens", path: "/dashboard/pathogens" },
      ],
      hasPermission: true,
    },
    {
      title: "การลงทะเบียนผู้รับบริการ",
      path: "/patient",
      hasPermission: permission.patient,
    },
    {
      title: "การจัดเก็บข้อมูลห้องปฏิบัติการ",
      path: "/laboratory",
      hasPermission: permission.lab,
    },
    {
      title: "การจัดการและค้นหาข้อมูล",
      path: "/search-information",
      hasPermission: permission.data,
    },
    {
      title: "การตั้งค่าข้อมูล",
      path: "/other",
      hasPermission: permission.management,
      submenu: [
        { title: "รายชื่อหน่วยงาน", path: "/other/hospital" },
        { title: "แบบฟอร์ม", path: "/other/form" },
        { title: "โปรแกรมรายการตรวจ", path: "/other/test-type" },
        { title: "Pathogens", path: "/other/pathogens" },
        { title: "ชนิดสิ่งส่งตรวจ", path: "/other/inspection-type" },
      ],
    },
    {
      title: "ข่าวสารและประชาสัมพันธ์",
      path: "/news",
      hasPermission: permission.news,
      submenu: [
        { title: "ข่าวสารและประชาสัมพันธ์", path: "/news" },
        { title: "ปฏิทินข่าวสาร", path: "/news/calendar" },
      ],
    },
    {
      title: "ระบบบริหารจัดการ",
      path: "/management/officer",
      hasPermission: permission.management,
    },
    {
      title: "ประวัติการใช้งาน",
      path: "/log",
      hasPermission: permission.history,
    },
  ];

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const { mutate: createLog } = useCreateLogAction();

  return (
    <FBSidebar aria-label="Sidebar with multi-level dropdown">
      <div className="relative h-full bg-white">
        <div className="absolute bottom-0 h-2/5 w-full bg-[url('/images/sidebar-bg.jpg')] bg-cover"></div>
        <div className="absolute bottom-0 h-2/5 w-full bg-gradient-to-t from-transparent to-white"></div>
        <div className="flex h-full select-none flex-col justify-between">
          <div className="flex flex-col p-4">
            <Image
              src={"/images/ddc-logo.svg"}
              width={160}
              height={150}
              alt="ddc-logo"
              className={`mb-10 hidden self-center py-5 md:block`}
            />
            <FBSidebar.ItemGroup className="z-50">
              {UserMenus.map((item, index) => {
                if (item.submenu) {
                  return (
                    <FBSidebar.Collapse
                      open={currentPage.startsWith(item.path)}
                      label={item.title}
                      key={index}
                      className={`${!item.hasPermission ? "hidden" : ""}  ${
                        currentPage.startsWith(item.path)
                          ? "bg-primary !text-white"
                          : ""
                      } cursor-pointer rounded-[5px] text-xs font-semibold text-primary !no-underline hover:bg-primary hover:text-white`}
                    >
                      {item.submenu?.map((sub, index) => (
                        <FBSidebar.Item
                          key={index}
                          href={sub.path}
                          onClick={() => {
                            createLog({ action: item.title });
                          }}
                          className={`${
                            !item.hasPermission ? "hidden" : ""
                          } cursor-pointer bg-secondary text-xs font-semibold text-primary !no-underline`}
                        >
                          {sub.title}
                        </FBSidebar.Item>
                      ))}
                    </FBSidebar.Collapse>
                  );
                } else {
                  return (
                    <FBSidebar.Item
                      key={index}
                      onClick={() => {
                        createLog({ action: item.title });
                        onNavigate && onNavigate(item.path);
                      }}
                      className={`${!item.hasPermission ? "hidden" : ""} ${
                        currentPage.startsWith(item.path) ||
                        currentPage.startsWith(item.path.split("/")[1])
                          ? "bg-primary !text-white"
                          : ""
                      } cursor-pointer rounded-[5px] text-xs font-semibold text-primary !no-underline`}
                    >
                      {item.title}
                    </FBSidebar.Item>
                  );
                }
              })}
            </FBSidebar.ItemGroup>
          </div>

          <div className="z-20 mb-40 p-4">
            <FBSidebar.ItemGroup>
              <FBSidebar.Item
                icon={BiLogOut}
                onClick={logout}
                style={{ cursor: "pointer" }}
                className={` rounded-[5px] bg-primary text-sm font-semibold text-white !no-underline`}
              >
                ออกจากระบบ
              </FBSidebar.Item>
            </FBSidebar.ItemGroup>
          </div>
        </div>
      </div>
    </FBSidebar>
  );
};

export default Sidebar;

"use client";

import React, { FC, useState } from "react";
import "./NavigatorTop.css";
import Logo from "../assets/images/Logo.png";
import Head from "../assets/images/Head.png";
import HeadCenter from "../assets/images/HeadCenter.png";
import Image from "next/image";
import HouseIcon from "../assets/icons/house";
import { Dropdown } from "flowbite-react";
import { BsList } from "react-icons/bs";
import { Routes } from "@/lib-client/constants";

type Menu = {
  name: string;
  link: string;
};

type NavigatorProps = {
  // TODO
  active?: string;
  onMenuClick: (link: string) => void;
};

const Navigator: FC<NavigatorProps> = ({ active, onMenuClick }) => {
  const [val] = useState<Menu[]>([
    { name: "เกี่ยวกับเรา", link: Routes.SITE.GUEST.ABOUT },
    { name: "ขั้นตอนการแจ้งเรื่อง", link: Routes.SITE.GUEST.STEP },
    { name: "ข่าวประชาสัมพันธ์", link: Routes.SITE.GUEST.NEWS },
    { name: "ข้อมูลบริการ", link: Routes.SITE.GUEST.CONTENTS },
    { name: "คำถามที่พบบ่อย", link: Routes.SITE.GUEST.FAQ },
    { name: "ติดต่อเรา", link: Routes.SITE.GUEST.CONTACT },
  ]);

  return (
    <>
      <nav className="navigator">
        <div className="navigator__head">
          <div className="navigator__logo">
            <Image src={Logo} alt="A stack of colorful cans" />
          </div>
          <Image
            src={Head}
            alt="A stack of colorful cans"
            className="hidden sm:block"
          />
          <Image
            src={HeadCenter}
            alt="A stack of colorful cans"
            className="hidden max-sm:block"
          />
        </div>
      </nav>
      <div className="navigator__mini">
        <Dropdown
          label={<BsList />}
          arrowIcon={false}
          dismissOnClick={false}
          color="primary"
          size={"xl"}
        >
          {val.map((item, index) => (
            <Dropdown.Item
              key={index}
              className="w-72"
              onClick={() => onMenuClick(item?.link)}
            >
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <nav className="navigator bg-primary">
        <div className={"navigator__container"}>
          <ul role="list" className="navigator__menu">
            <li data-ui={active === "/" ? "active" : ""}>
              <button
                type="button"
                onClick={() => {
                  onMenuClick("/");
                }}
              >
                <HouseIcon color="#fff" className="h-full" />
              </button>
            </li>
            {val.map((item, index) => (
              <li key={index} data-ui={item.link === active ? "active" : ""}>
                <button
                  type="button"
                  onClick={() => {
                    onMenuClick(item?.link);
                  }}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigator;

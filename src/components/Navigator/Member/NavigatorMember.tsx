"use client";

import React, { FC, useEffect } from "react";
import "./NavigatorMember.css";
import { Dropdown } from "flowbite-react";
import {
  BsArrowsFullscreen,
  BsFillPersonFill,
  BsKey,
  BsList,
  BsLock,
} from "react-icons/bs";

type NavigatorMemberProps = {
  // TODO
  name?: string;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  onChangePasswordClick?: () => void;
};

const NavigatorMember: FC<NavigatorMemberProps> = ({
  name,
  onChangePasswordClick,
  onLogoutClick,
  onMenuClick,
  onProfileClick,
}) => {
  function goFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  useEffect(() => {
    // TODO
  }, []);

  return (
    <div className="navigator_member">
      <div className="navigator_member_container">
        <div className="flex flex-1 items-center gap-4">
          <button onClick={onMenuClick}>
            <BsList className="h-6 w-6" />
          </button>
          <button onClick={goFullScreen}>
            <BsArrowsFullscreen className="h-4 w-4" />
          </button>
          <p className="self-center truncate whitespace-nowrap font-semibold text-white">
            ศูนย์บริการเกษตรพิรุณราช กระทรวงเกษตรและสหกรณ์
          </p>
        </div>
        <div className="">
          <Dropdown arrowIcon={true} inline label={name} className="w-64">
            <Dropdown.Item icon={BsFillPersonFill} onClick={onProfileClick}>
              ประวัติส่วนตัว
            </Dropdown.Item>
            <Dropdown.Item icon={BsKey} onClick={onChangePasswordClick}>
              เปลี่ยนรหัสผ่าน
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={BsLock} onClick={onLogoutClick}>
              ออกระบบ
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default NavigatorMember;

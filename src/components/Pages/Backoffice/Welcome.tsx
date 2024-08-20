import { Button } from "flowbite-react";
import React, { FC } from "react";
import { BsSave2 } from "react-icons/bs";

const BackofficeWelcome: FC = () => {
  return (
    <div className="flex flex-col divide-y-2 bg-white">
      <div className="border-t-2 border-primary px-5 py-4">
        <h1 className="text-primary">ยินดีต้อนรับสู่ระบบขอรับบริการ</h1>
      </div>
      <div className="px-5 py-6">
        <p className="indent-6">
          สืบเนื่องจากรัฐบาลมีนโยบายด้านการแก้ปัญหาความเดือดร้อนของประชาชนโดยยึดหลัก
          “ประชาชนเป็นศูนย์กลางของการแก้ไขปัญหา”
          โดยคณะรัฐมนตรีได้มีมติให้ทุกกระทรวงจัดตั้ง
          ศูนย์ประสานงานการแก้ไขปัญหาตามข้อร้องเรียนของประชาชนขึ้น
          เพื่อเป็นศูนย์กลางให้บริการด้านการเกษตรและประสานการดำเนินงานเครือข่าย
        </p>
        <p className="indent-6">
          ในการให้บริการ หลังจากที่หน่วยงานในสังกัด กษ.
          ได้รับเรื่องแล้วสามารถดำเนินการได้เองหรือจะดำเนินการ
          ส่งต่อเรื่องไปยังหน่วยงานที่รับผิดชอบ เพื่อดำเนินการ
          เมื่อดำเนินการแล้วจะมีการแจ้ง ให้ประชาชนทราบต่อไป
          โดยประชาชนสามารถติดตามการดำเนินงานได้ ผ่านเว็บไซต์นี้
        </p>
      </div>
      <div className="px-5 py-4">
        <Button className="mx-auto">
          <div className="flex flex-row items-center gap-4">
            <BsSave2 />
            <p>คู่มือการใช้งาน</p>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default BackofficeWelcome;

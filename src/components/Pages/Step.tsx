import React, { FC } from "react";
import Image from "next/image";
import Activity from "../assets/images/Activity.png";
import { BsChevronRight } from "react-icons/bs";
const Step: FC = () => {
  return (
    <div className="flex flex-col divide-y-2">
      <div className="py-6">
        <div className="flex w-fit flex-row items-center gap-2">
          <p>
            <a className="text-[#1abc9c]" href="/">
              หน้าหลัก
            </a>{" "}
            <BsChevronRight className="inline-block" />{" "}
            <span>ขั้นตอนการแจ้งเรื่อง</span>
          </p>
        </div>
      </div>
      <div>
        <div className="py-6">
          <div className="flex flex-row items-center justify-center">
            <div className="border-b-2 border-primary px-8">
              <h1 className="text-primary">ขั้นตอนการแจ้งขอรับบริการ</h1>
            </div>
          </div>
          <p>
            1. ประชาชนจะต้องลงทะเบียนผู้ใช้ โดยคลิกที่ “ลงทะเบียน”
            จากนั้นป้อนข้อมูลลงทะเบียน ประกอบด้วย ชื่อผู้ใช้งาน และ รหัสผ่าน และ
            ข้อมูลส่วนตัว ประกอบด้วย เลขประจำตัวประชาชน คำนำหน้าชื่อ ชื่อ
            นามสกุล เพศ และอีเมล
          </p>
          <p>
            2. เมื่อลงทะเบียนเรียบร้อย ให้คลิกที่แจ้งเรื่อง
            จากนั้นให้กรอกรายละเอียดของเรื่องที่ต้องการขอรับบริการ
            และรายละเอียดต่างๆ ของเรื่องที่ต้องการขอรับบริการ
            หรือสถานที่ที่ต้องการขอรับบริการ หน่วยงานที่ต้องการขอรับบริการ
            หรือสิ่งที่ต้องการให้กระทรวงดำเนินการและช่องทางการแจ้งกลับ
          </p>
          <p>
            3. เลือกช่องทางการติดต่อกลับ
            เพื่อเป็นข้อมูลให้เจ้าหน้าที่ได้ติดต่อท่านกลับในภายหลัง
          </p>
          <p>4. คลิกที่ปุ่มส่งเรื่อง โดยระบบจะส่งเรื่องไปยังเจ้าหน้าที่ต่อไป</p>
        </div>
        <div className="py-6">
          <div className="flex flex-row items-center justify-center">
            <div className="border-b-2 border-primary px-8">
              <h1 className="text-primary">
                ขั้นตอนการติดตามเรื่องขอรับบริการ
              </h1>
            </div>
          </div>
          <p>
            1. ประชาชนล็อกอินโดยใช้ ชื่อผู้ใช้งาน และ รหัสผ่าน
            ที่กำหนดไว้ก่อนหน้านี้
          </p>
          <p>2. ระบบจะแสดงเรื่องที่ยื่นร้องเรียนเอาไว้ และ สถานะเรื่อง</p>
        </div>
        <div className="py-6">
          <div className="flex flex-row items-center justify-center">
            <div className="border-b-2 border-primary px-8">
              <h1 className="text-center text-primary">
                แผนผังกระบวนการทำงาน ศูนย์บริการเกษตรพิรุณราช
                กระทรวงเกษตรและสหกรณ์
              </h1>
            </div>
          </div>
          <Image src={Activity} width={0} height={0} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Step;

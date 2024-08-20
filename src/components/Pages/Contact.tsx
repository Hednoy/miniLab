import React from "react";
import Map from "../assets/images/Map.jpg";
import Image from "next/image";
import {
  BsChatSquareDotsFill,
  BsChevronRight,
  BsMailbox,
  BsTelephone,
} from "react-icons/bs";
const Contact: React.FC = () => {
  return (
    <div className="flex flex-col divide-y-2">
      <div className="py-6">
        <div className="flex w-fit flex-row items-center gap-2">
          <p>
            <a className="text-[#1abc9c]" href="/">
              หน้าหลัก
            </a>{" "}
            <BsChevronRight className="inline-block" />{" "}
            <span>เกี่ยวกับเรา</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-2 py-6">
        <div className="mx-auto flex w-full max-w-screen-md flex-row items-center justify-center">
          <div className="border-b-2 border-primary px-8">
            <h1 className="text-primary">ติดต่อเรา</h1>
          </div>
        </div>
        <div className="content has-text-centered flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-[#4b7a2b]">
            สำนักบริหารกองทุนเพื่อช่วยเหลือเกษตรกรและรับเรื่องร้องเรียน
            สำนักงานปลัดกระทรวงเกษตรและสหกรณ์
          </p>
          <p className="text-sm">
            เลขที่ 3 ถนนราชดำเนินนอก แขวงบ้านพานถม เขตพระนคร กรุงเทพฯ 10200
          </p>
          <p className="footer-text">
            <BsTelephone className="inline-block" /> โทรศัพท์ :{" "}
            <label className="text-[#1abc9c]">02-629-9091</label> ,{" "}
            <label className="text-[#1abc9c]">02-629-9072</label>
          </p>
          <p className="footer-text">
            <BsChatSquareDotsFill className="inline-block" /> โทรสาร :
            02-629-8985
          </p>
          <p className="footer-text">
            <BsMailbox className="inline-block" /> email :{" "}
            <label className="text-[#1abc9c]">moacbfa@gmail.com</label>
          </p>
          <div>
            <Image src={Map} alt="map" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

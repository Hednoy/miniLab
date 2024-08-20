import { BsChatSquareDotsFill, BsMailbox, BsTelephone } from "react-icons/bs";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="content has-text-centered text-center">
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
          <p className="text-sm">
            Copyright © 2023 กระทรวงเกษตรและสหกรณ์. All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

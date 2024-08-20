import React, { useEffect } from "react";
import { Button, Checkbox } from "flowbite-react";
import { BsChevronRight } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib-client/constants";
import { on } from "events";

type AgreeProps = {
  onClickHome: () => void;
  onClickSignup: () => void;
};

const Agree: React.FC<AgreeProps> = ({ onClickHome, onClickSignup }) => {
  const [checked, setChecked] = React.useState(false);

  return (
    <div className="flex flex-col divide-y-2">
      <div className="py-6">
        <div className="flex w-fit flex-row items-center gap-2">
          <p>
            <a
              className="text-[#1abc9c]"
              onClick={() => {
                onClickHome();
              }}
            >
              หน้าหลัก
            </a>{" "}
            <BsChevronRight className="inline-block" />{" "}
            <span>ข้อตกลงหลักเกณฑ์รับเรื่องร้องเรียน/ร้องทุกข์</span>
          </p>
        </div>
      </div>
      <div className="gap-2 divide-y-2">
        <div className="py-6">
          <div className="mb-2 flex flex-row items-center justify-center">
            <div className="border-b-2 border-primary px-8">
              <h1 className="text-center text-primary">
                ข้อตกลงหลักเกณฑ์รับเรื่องร้องเรียน/ร้องทุกข์
              </h1>
            </div>
          </div>
          <h2 className="text-center underline">
            เพื่อประโยชน์ของตัวท่านเองและส่วนราชการ
          </h2>
          <h2 className="text-center">
            ขอความกรุณาจากท่าน โปรดอ่านก่อนท่านจะแจ้งเรื่องร้องเรียน
          </h2>
          <div className="text-sm">
            หลักเกณฑ์ที่กระทรวงเกษตรและสหกรณ์ดำเนินการเรื่องร้องเรียนดังนี้
            <br />
            ๑. ขอให้ท่านใช้ถ้อยคำหรือข้อความที่สุภาพ และท่านควรให้ข้อมูลดังนี้
            <br />
            <span className="pl-4">
              • วัน เดือน ปี ที่ท่านพบปัญหาเรื่องร้องเรียน
            </span>
            <br />
            <span className="pl-4">
              • ชื่อ ที่อยู่ หมายเลขโทรศัพท์ อีเมล (E-Mail)
              ที่สามารถติดต่อถึงตัวท่านได้
            </span>
            <br />
            <span className="pl-4">
              • มีข้อเท็จจริงของเรื่องที่ร้องเรียน
              ที่แสดงว่าตัวท่านได้รับความเดือดร้อนหรือเสียหายในเรื่องที่เกี่ยวข้องกับการดำเนินการใดๆ
              ของหน่วยงานในสังกัดกระทรวงเกษตรและสหกรณ์
              และต้องการให้กระทรวงเกษตรและสหกรณ์ดำเนินการแก้ไขอย่างไร
            </span>
            <br />
            ๒. เรื่องร้องเรียนต้องเป็นเรื่องจริง
            มิได้หวังสร้างกระแสหรือสร้างข่าวเพื่อให้เกิดความเสียหายต่อบุคคลใดหากเป็นการกล่าวแบบเลื่อนลอยผู้ถูกกล่าวหาอาจฟ้องกลับท่านในฐานะหมิ่นประมาทได้
          </div>
          <div className="text-sm">
            <span className="text-base font-bold">
              <u>
                หลักเกณฑ์ทีกระทรวงเกษตรและสหกรณ์จะไม่รับดำเนินการเรื่องร้องเรียน
              </u>
            </span>
            <br />
            ๑. เรื่องร้องเรียนที่เกี่ยวข้องกับสถาบันกษัตริย์
            เรื่องร้องเรียนที่มีข้อมูลไม่ครบถ้วน ไม่เพียงพอ
            หรือไม่สามารถหาข้อมูลเพิ่มเติมได้ในการตรวจสอบข้อเท็จจริง
            ซึ่งอาจเข้าข่ายเป็นบัตรสนเท่ห์ ตามมติคณะรัฐมนตรี เมื่อวันที่ 22
            ธันวาคม 2541
            <br />
            ๒.
            เรื่องร้องเรียนที่เข้าสู่กระบวนการยุติธรรมแล้วหรือเป็นเรื่องที่ศาลได้มีคำสั่งพิพากษาหรือคำสั่งถึงที่สุดแล้ว
            <br />
            ๓. เรื่องร้องเรียนที่หน่วยงานอื่นได้ดำเนินการตรวจสอบ พิจารณาวินิจฉัย
            และได้มีข้อสรุปผลการพิจารณาเป็นที่เรียบร้อยแล้ว
          </div>
          <div className="text-sm">
            <span className="text-base font-bold">
              คำรับรองการร้องเรียนของท่าน
            </span>
            <br />
            ๑.
            ท่านรับรองว่าข้อเท็จจริงที่ได้แจ้งเรื่องร้องเรียนต่อกระทรวงเกษตรและสหกรณ์เป็นเรื่องที่เกิดขึ้นจริงทั้งหมดและท่านขอรับผิดชอบต่อเท็จจริงดังกล่าวข้างต้นทุกประการ
            <br />
            ๒. ท่านรับทราบแล้วว่า การนำความเท็จมาร้องเรียนต่อเจ้าหน้าที่
            ซึ่งทำให้ผู้อื่นได้รับความเสียหายอาจเป็นความผิดฐานแจ้งความเท็จต่อเจ้าพนักงานตามประมวลกฎหมายอาญา
            <br />
            ๓. กรณีสืบทราบว่าท่านเป็นเจ้าหน้าที่รัฐ
            และแจ้งเรื่องร้องเรียนเท็จเพื่อก่อให้เกิดความเสื่อมเสียชื่อเสียง
            ของหน่วยงานรัฐหรือเจ้าหน้าที่ของหน่วยงานรัฐ
            ท่านจะถูกดำเนินการทางวินัยทางราชการด้วย
            <br />
            ๔. หากท่านมีเจตนาแจ้งเรื่องกลั่นแกล้งบุคคลใด หรือแจ้งเรื่องเท็จ
            เจ้าหน้าที่อาจมีการบันทึกเสียงท่านเพื่อใช้ในการตรวจสอบตัวตนของท่านได้
            และสามารถตรวจสอบได้ว่าท่านใช้เครื่องคอมพิวเตอร์ IP ใด ในช่วงเวลาใด
            เพื่อใช้ในการตรวจสอบตัวตนของท่านได้
            เพื่อดำเนินการตามระเบียบกฎหมายที่เกี่ยวข้องต่อไปได้
            จึงขอให้ท่านแจ้งเรื่องที่เป็นข้อเท็จจริงเท่านั้น
          </div>

          <div className="footerText mt-4 text-right text-primary">
            <span>
              กลุ่มรับเรื่องร้องเรียน
              สำนักบริหารกองทุนเพื่อช่วยเหลือเกษตรกรและรับเรื่องร้องเรียน
            </span>
            <br />
            <span>สำนักงานปลัดกระทรวงเกษตรและสหกรณ์</span>
          </div>
        </div>
        <div className="py-6">
          <div className="flex flex-row items-center justify-center">
            <div className="flex flex-row gap-4 px-8">
              <Checkbox
                className="mt-2"
                checked={checked}
                onChange={() => {
                  setChecked(!checked);
                }}
              />
              <p>
                ข้าพเจ้าขอรับรองว่าข้อเท็จจริงที่ได้แจ้งเรื่องร้องเรียนต่อสำนักงานปลัดกระทรวงเกษตรและสหกรณ์
                เป็นเรื่องที่เกิดขึ้นจริงทั้งหมดและขอรับผิดชอบต่อข้อเท็จจริงดังกล่าวข้างต้นทุกประการ
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center py-6">
          <Button
            disabled={!checked}
            onClick={() => {
              onClickSignup();
            }}
          >
            ถัดไป
          </Button>
        </div>
      </div>
    </div>
  );
};

export { Agree };

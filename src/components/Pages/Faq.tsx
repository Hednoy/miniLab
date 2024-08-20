import React from "react";
import { BsChevronDoubleRight, BsChevronRight } from "react-icons/bs";

type Faq = {
  question: string;
  answer: string;
};

type FaqProps = {
  data: Faq[];
};

const Faq: React.FC<FaqProps> = ({ data }) => {
  const [active, setActive] = React.useState<number>(-1);
  return (
    <div className="flex flex-col divide-y-2">
      <div className="py-6">
        <div className="flex w-fit flex-row items-center gap-2">
          <p>
            <a className="text-[#1abc9c]" href="/">
              หน้าหลัก
            </a>{" "}
            <BsChevronRight className="inline-block" />{" "}
            <span>คำถามที่พบบ่อย</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-2 py-6">
        <div className="flex flex-row items-center justify-center">
          <div className="border-b-2 border-primary px-8">
            <h1 className="text-primary">คำถามที่พบบ่อย</h1>
          </div>
        </div>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col gap-4 p-4">
            <div
              className="flex cursor-pointer select-none flex-row items-center justify-between"
              onClick={() => setActive(active === index ? -1 : index)}
            >
              <div className="flex flex-row items-center gap-2">
                <BsChevronDoubleRight className="text-primary" />
                <p className="text-primary">{item.question}</p>
              </div>
            </div>
            {active === index && (
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <p className="text-black">{item.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;

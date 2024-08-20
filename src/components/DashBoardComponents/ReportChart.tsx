"use client";
import { Chart } from "react-google-charts";
import React, { useState } from "react";
export const data = [
  "อ่างทอง",
  "พระนครศรีอยุธยา",
  "กรุงเทพมหานคร",
  "ชัยนาท",
  "ลพบุรี",
  "นครปฐม",
  "นนทบุรี",
  "ปทุมธานี",
  "สมุทรปราการ",
  "สมุทรสงคราม",
  "สมุทรสาคร",
  "สระบุรี",
  "สิงห์บุรี",
  "สุพรรณบุรี",
  "นครนายก",
  "ฉะเชิงเทรา",
  "จันทบุรี",
  "ชลบุรี",
  "ปราจีนบุรี",
  "ระยอง",
  "สระแก้ว",
  "ตราด",
  "กาญจนบุรี",
  "ราชบุรี",
  "เพชรบุรี",
  "ประจวบคีรีขันธ์",
  "เชียงใหม่",
  "เชียงราย",
  "ลำปาง",
  "ลำพูน",
  "แม่ฮ่องสอน",
  "น่าน",
  "พะเยา",
  "แพร่",
  "อุตรดิตถ์",
  "ตาก",
  "สุโขทัย",
  "พิษณุโลก",
  "พิจิตร",
  "กำแพงเพชร",
  "เพชรบูรณ์",
  "นครสวรรค์",
  "อุทัยธานี",
  "อำนาจเจริญ",
  "บึงกาฬ",
  "TH-38",
  "บุรีรัมย์",
  "ชัยภูมิ",
  "กาฬสินธุ์",
  "ขอนแก่น",
  "เลย",
  "มหาสารคาม",
  "มุกดาหาร",
  "นครพนม",
  "นครราชสีมา",
  "หนองบัวลำภู",
  "หนองคาย",
  "ร้อยเอ็ด",
  "สกลนคร",
  "ศรีสะเกษ",
  "สุรินทร์",
  "อุบลราชธานี",
  "อุดรธานี",
  "ยโสธร",
  "ชุมพร",
  "นครศรีธรรมราช",
  "นราธิวาส",
  "ปัตตานี",
  "พัทลุง",
  "สงขลา",
  "สุราษฎร์ธานี",
  "ยะลา",
  "กระบี่",
  "พังงา",
  "ภูเก็ต",
  "ระนอง",
  "สตูล",
  "ตรัง",
];
const chartTitle = ["Provinces", "Partnership"];
export const options = {
  region: "TH",
  resolution: "provinces",
  defaultColor: "#f5f5f5",
};
const mocking = () => (Math.random() * 1000).toFixed(0);

const chartData = (region: any[]) =>
  region.map((item: any) => [item, +mocking()]);
export default function CardReportChart() {
  const [state, setState] = useState([chartTitle, ...chartData(data)]);

  return (
    <Chart
      chartEvents={[
        {
          eventName: "select",
          callback: ({ chartWrapper }) => {
            const chart = chartWrapper.getChart();
            const selection = chart.getSelection();

            if (selection.length === 0) return;

            console.log("Selected : " + JSON.stringify(selection));
            const region = data[selection[0].row + 1];
            console.log("Selected : " + region);
          },
        },
      ]}
      chartType="GeoChart"
      width="100%"
      height="100%"
      data={state}
      options={options}
    />
  );
}

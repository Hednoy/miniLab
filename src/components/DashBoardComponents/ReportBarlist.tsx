"use client";
import React from "react";
import { Chart } from "react-google-charts";
import { List } from "flowbite-react";
export const default_data = [
  [
    "Element",
    "Density",
    { role: "style" },
    {
      sourceColumn: 0,
      role: "annotation",
      type: "string",
      calc: "stringify",
    },
  ],
];
interface Props {
  data: any[];
}
export const options = {
  title: "",

  bar: { groupWidth: "95%" },
  legend: { position: "none" },
};

const ReportBarlist: React.FC<Props> = (props) => {
  return (
    <>
      <Chart
        chartType="BarChart"
        width="100%"
        height="80%"
        data={[...default_data, ...props.data]}
        options={options}
      />
      <List unstyled>
        {props.data.map((item, index) => (
          <>
            <List.Item>
              {item[0]} : {item[1]}
            </List.Item>
          </>
        ))}
      </List>
    </>
  );
};
export default ReportBarlist;

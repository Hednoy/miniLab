"use client";
import React from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "",
  pieHole: 0.4,
  is3D: false,
};

interface Props {
  data: any[];
}

const CardReportDonutChart: React.FC<Props> = (props) => {
  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="100%"
      data={props.data}
      options={options}
    />
  );
};

export default CardReportDonutChart;

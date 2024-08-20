"use client";
import React from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "",
  pieHole: 0,
  is3D: true,
};

interface Props {
  data: any[];
}

const CardReportPieChart: React.FC<Props> = (props) => {
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

export default CardReportPieChart;

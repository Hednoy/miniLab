import CustomDatePicker from "@/components/Datepicker/CustomDatePicker";
import { Routes } from "@/lib-client/constants";
import axiosInstance from "@/lib-client/react-query/axios";
import {
  useDashboardChart,
  useDashboardChartPathogens,
} from "@/lib-client/react-query/dashboard/useDashboardChart";
import { useTestTypeAll } from "@/lib-client/react-query/test-type";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label, Select } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { FC, use, useEffect, useMemo, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import Papa from "papaparse";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { format } from "date-fns";
import {
  usePathogens,
  usePathogensById,
} from "@/lib-client/react-query/pathogens";

import "./dashboard.css";

const DashboardPathogens: FC = () => {
  const { push } = useRouter();
  const [textSearch, setTextSearch] = useState("");

  const [pathogens, setPathogens] = useState<string>("");
  // const [pathogensList, setPathogensList] = useState<any[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const { data: testtypeAll } = useTestTypeAll();
  const { data: dashboardChart } = useDashboardChartPathogens({
    // test_type_id: 0,
    pathogensId: Number(pathogens),
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [filter, setFilter] = useState({
    pathogens_id: "",
    dateStart: "",
    dateEnd: "",
    testTypeId: "",
    result: "",
  });

  const { data: pathogensList } = usePathogens({
    limit: 100,
    page: 1,
  });

  const pathogensId = Number(pathogens);
  const { data: pathogensLists } = usePathogensById(pathogensId);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const startDate = format(
      new Date(new Date().getFullYear(), month - 1, 1),
      "yyyy-MM-dd'T'HH:mm:ss'Z'"
    );
    let endDate = "";
    if (month == currentMonth) {
      endDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    } else {
      endDate = format(
        new Date(new Date().getFullYear(), month, 0),
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
      );
    }
    // console.log(pathogens);
    setFilter({
      ...filter,
      dateStart: startDate,
      dateEnd: endDate,
      pathogens_id: pathogens,
    });
  }, [month, pathogens]);

  async function Search() {
    push(
      `/dashboard/view?dateStart=${filter.dateStart}&dateEnd=${filter.dateEnd}&textSearch=${textSearch}&test_type_id=${filter.testTypeId}&result=${filter.result}`
    );
  }

  const refs = {
    dateStart: useRef<any>(),
    dateEnd: useRef<any>(),
  };

  async function Export() {
    await axiosInstance
      .get<any>(Routes.API.DASHBOARD_REPORT, {
        params: {
          page: currentPage,
          dateStart: filter.dateStart,
          dateEnd: filter.dateEnd,
          test_type_id: Number(filter.testTypeId),
          result: filter.result,
        },
      })
      .then((response) => {
        // Parse CSV data
        const parsedData = Papa.parse(response.data, { header: true });

        // Convert parsed data to CSV format
        const csvContent = Papa.unparse(parsedData.data, { header: true });

        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], {
          type: "text/csv; charset=utf-8",
        });

        // Create a temporary anchor element
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Database LAB IUDC";

        // Programmatically click the link to trigger the download
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {
        swal.fire({
          title: "พบข้อผิดพลาด",
          icon: "success",
          iconHtml: customIcons.error,
        });
      });
  }

  const chartData = useMemo(() => {
    return Object.keys(dashboardChart || {})
      .filter((f) => f != "total")
      .map((item) => {
        return {
          name: pathogensList?.find((f) => `${f.id}` === item)?.name || "",
          value: dashboardChart?.[item],
          percentage: (dashboardChart?.[item] / dashboardChart?.total) * 100,
          // percentage: dashboardChart ? dashboardChart?.detected_percentage : 0,
        };
      });
  }, [dashboardChart]);

  // random colors by length pathogens
  // const COLORS = useMemo(() => {
  //   return pathogensList.map((item: any, index: number) => {
  //     return "#" + Math.floor(Math.random() * 16777215).toString(16);
  //   });
  // }, [dashboardChart]);

  // random colors 40 length
  const COLORS = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
  ];

  const renderLegend = (props: any) => {
    const { payload } = props || {};
    return (
      <div className="flex flex-col">
        <table className="dashboard">
          <thead>
            <tr className="text-left">
              <th>Pathogens</th>
              <th>จำนวน</th>
              <th>คิดเป็น</th>
            </tr>
          </thead>
          <tbody>
            {payload.map((entry: any, index: any) => (
              <tr key={index}>
                <td className="truncate">{entry.value}</td>
                <td className="truncate">{entry.payload.payload.value} คน</td>
                <td className="truncate text-primary">
                  (คิดเป็น {entry.payload.percentage.toFixed(2)}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary ">
          Dashboard Pathogens
        </div>
        <div className="relative">
          <input
            type="text"
            id="table-search"
            placeholder="ค้นหา"
            className="border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400 block w-full max-w-80 rounded-lg border p-2 pe-10 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            onChange={(e) => setTextSearch(e.currentTarget.value)}
            value={textSearch}
          />
          <div className="rtl:inset-l-0 pointer-events-none absolute inset-y-0 right-0 flex items-center pe-3 rtl:left-0">
            <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
      <div className="mb-6 rounded-[20px] p-6 shadow-sm shadow-primary">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p>
            การตรวจเชื้อโรค : {dashboardChart ? dashboardChart.total : 0} ครั้ง
          </p>
          <div className="flex flex-row gap-3">
            <Select
              value={pathogens}
              onChange={(e: any) => {
                setPathogens(e.currentTarget.value);
              }}
            >
              <option value="">ทั้งหมด</option>
              {pathogensList?.map((item: any, index: number) => (
                <option value={item.id} key={index}>
                  {item.name}
                </option>
              ))}
            </Select>
            <Select
              value={month}
              onChange={(e: any) => {
                setMonth(e.currentTarget.value);
              }}
            >
              <option value={1}>มกราคม</option>
              <option value={2}>กุมภาพันธ์</option>
              <option value={3}>มีนาคม</option>
              <option value={4}>เมษายน</option>
              <option value={5}>พฤษภาคม</option>
              <option value={6}>มิถุนายน</option>
              <option value={7}>กรกฎาคม</option>
              <option value={8}>สิงหาคม</option>
              <option value={9}>กันยายน</option>
              <option value={10}>ตุลาคม</option>
              <option value={11}>พฤศจิกายน</option>
              <option value={12}>ธันวาคม</option>
            </Select>
          </div>
        </div>
        <ResponsiveContainer width={"100%"} height={400}>
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend
              content={renderLegend}
              align="right"
              verticalAlign="middle"
              width={400}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DashboardPathogens;

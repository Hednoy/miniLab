import CustomDatePicker from "@/components/Datepicker/CustomDatePicker";
import { Routes } from "@/lib-client/constants";
import axiosInstance from "@/lib-client/react-query/axios";
import { useDashboardChart } from "@/lib-client/react-query/dashboard/useDashboardChart";
import { useTestTypeAll } from "@/lib-client/react-query/test-type";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label, Select } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import Papa from "papaparse";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { format } from "date-fns";
import * as XLSX from "xlsx";

const Dashboard: FC = () => {
  const { push } = useRouter();
  const [textSearch, setTextSearch] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const { data: testtypeAll } = useTestTypeAll();
  const [chartData, setChartData] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    dateStart: "",
    dateEnd: "",
    testTypeId: "",
    result: "",
  });

  const updateChartData = (dashboardChart: any) => {
    setChartData([
      {
        name: "Detected",
        value: dashboardChart ? dashboardChart?.detected : 0,
        percentage: dashboardChart ? dashboardChart?.detected_percentage : 0,
      },
      {
        name: "Not Detected",
        value: dashboardChart ? dashboardChart?.not_detected : 0,
        percentage: dashboardChart
          ? dashboardChart?.not_detected_percentage
          : 0,
      },
      {
        name: "Positive",
        value: dashboardChart ? dashboardChart?.positive : 0,
        percentage: dashboardChart ? dashboardChart?.positive_percentage : 0,
      },
      {
        name: "Negative",
        value: dashboardChart ? dashboardChart?.negative : 0,
        percentage: dashboardChart ? dashboardChart?.negative_percentage : 0,
      },
      {
        name: "Indeterminate",
        value: dashboardChart ? dashboardChart?.indeterminate : 0,
        percentage: dashboardChart
          ? dashboardChart?.indeterminate_percentage
          : 0,
      },
      {
        name: "Borderline",
        value: dashboardChart ? dashboardChart?.borderline : 0,
        percentage: dashboardChart ? dashboardChart?.borderline_percentage : 0,
      },
    ]);
  };

  useEffect(() => {
    const fetchDashboardChart = async () => {
      try {
        const response = await axiosInstance.get<any>(
          Routes.API.DASHBOARD_CHART,
          {
            params: {
              month: Number(month),
            },
          }
        );
        updateChartData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const currentMonth = new Date().getMonth() + 1;
    const startDate = format(
      new Date(new Date().getFullYear(), month - 1, 1),
      "yyyy-MM-dd'T'HH:mm:ss'Z'"
    );
    let endDate = "";
    if (month === currentMonth) {
      endDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    } else {
      endDate = format(
        new Date(new Date().getFullYear(), month, 0),
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
      );
    }

    setFilter({ ...filter, dateStart: startDate, dateEnd: endDate });
    fetchDashboardChart();
  }, [month]);

  async function Search() {
    push(
      `/dashboard/view?dateStart=${filter.dateStart}&dateEnd=${filter.dateEnd}&textSearch=${textSearch}&test_type_id=${filter.testTypeId}&result=${filter.result}`
    );
  }

  const refs = {
    dateStart: useRef<any>(),
    dateEnd: useRef<any>(),
  };

  // async function Export() {
  //   await axiosInstance
  //     .get<any>(Routes.API.DASHBOARD_REPORT, {
  //       params: {
  //         page: 1,
  //         dateStart: filter.dateStart,
  //         dateEnd: filter.dateEnd,
  //         test_type_id: Number(filter.testTypeId),
  //         result: filter.result,
  //       },
  //     })
  //     .then((response) => {
  //       const parsedData = Papa.parse(response.data, { header: true });
  //       const csvContent = Papa.unparse(parsedData.data, { header: true });
  //       const blob = new Blob([csvContent], {
  //         type: "text/csv; charset=utf-8",
  //       });
  //       const link = document.createElement("a");
  //       link.href = window.URL.createObjectURL(blob);
  //       link.download = "Database LAB IUDC";
  //       document.body.appendChild(link);
  //       link.click();
  //     })
  //     .catch((error) => {
  //       swal.fire({
  //         title: "พบข้อผิดพลาด",
  //         icon: "success",
  //         iconHtml: customIcons.error,
  //       });
  //     });
  // }
  async function Export() {
    await axiosInstance
      .get<any>(Routes.API.DASHBOARD_REPORT, {
        params: {
          page: 1,
          dateStart: filter.dateStart,
          dateEnd: filter.dateEnd,
          test_type_id: Number(filter.testTypeId),
          result: filter.result,
        },
      })
      .then((response) => {
        const parsedData = Papa.parse(response.data, { header: true });
        const ws = XLSX.utils.json_to_sheet(parsedData.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Database LAB IUDC");
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
        const blob = new Blob([s2ab(wbout)], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Database LAB IUDC.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        swal.fire({
          title: "พบข้อผิดพลาด",
          icon: "error",
          iconHtml: customIcons.error,
        });
      });
  }

  // Helper function to convert string to ArrayBuffer
  function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
  const COLORS = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
  ];

  const renderLegend = (props: any) => {
    const { payload } = props || {};
    return (
      <div className="flex flex-col">
        {payload.map((entry: any, index: any) => (
          <div className="flex items-center gap-1" key={`item-${index}`}>
            <div
              className={`h-3 w-3 rounded-[9999px] bg-[${entry.color}]`}
            ></div>
            <div className="flex gap-2">
              <p>
                {entry.value} : {entry.payload.payload.value} คน
              </p>
              <p className="text-primary">
                (คิดเป็น {entry.payload.percentage}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary ">
          Dashboard
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
            จำนวนผู้เข้ารับการตรวจรวม :{" "}
            {chartData.reduce((total, entry) => total + entry.value, 0)} คน
          </p>

          <Select
            value={month}
            onChange={(e) => setMonth(Number(e.currentTarget.value))}
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
              width={320}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6 flex items-center justify-start">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary ">
          เรียกดูข้อมูล
        </div>
      </div>

      <div className="mb-6 rounded-[20px] p-6 shadow-sm shadow-primary">
        <div className="mb-6 flex flex-wrap justify-between gap-3">
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <div className="block">
                <Label htmlFor="dateStart" value={`วันที่เริ่มต้น`} />
              </div>
              <CustomDatePicker
                ref={refs.dateStart}
                onChange={(selectDate: string) => {
                  setFilter({ ...filter, dateStart: selectDate });
                }}
                value={filter.dateStart ? new Date(filter.dateStart) : null}
              />
            </div>
            <p className="pb-2">จนถึง</p>
            <div>
              <div className="block">
                <Label htmlFor="dateEnd" value={`วันที่สิ้นสุด`} />
              </div>
              <CustomDatePicker
                ref={refs.dateEnd}
                onChange={(selectDate: string) =>
                  setFilter({ ...filter, dateEnd: selectDate })
                }
                value={filter.dateEnd ? new Date(filter.dateEnd) : null}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="max-w-40">
              <div className="block">
                <Label htmlFor="test_type_id" value={`โปรแกรมรายการตรวจ`} />
              </div>
              <Select
                id="test_type_id"
                value={filter.testTypeId}
                onChange={(e) =>
                  setFilter({ ...filter, testTypeId: e.currentTarget.value })
                }
              >
                <option value="0">ทั้งหมด</option>
                {testtypeAll.map((item: any, index: number) => (
                  <option value={item.id} key={index}>
                    {item.prefix_name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <div className="block">
                <Label htmlFor="test_result" value={`ผลทดสอบ`} />
              </div>
              <Select
                value={filter.result}
                onChange={(e) =>
                  setFilter({ ...filter, result: e.currentTarget.value })
                }
              >
                <option value={""}>ทั้งหมด</option>
                <option value={"1"}>Detected</option>
                <option value={"2"}>Not Detected</option>
                <option value={"3"}>Positive</option>
                <option value={"4"}>Negative</option>
                <option value={"5"}>Indeterminate</option>
                <option value={"6"}>Borderline</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            className={`rounded-[5px] bg-primary px-4 py-2 text-sm font-semibold text-white !no-underline`}
            onClick={Search}
          >
            เรียกดู
          </button>
          <button
            type="button"
            className={`rounded-[5px] bg-primary-pink px-4 py-2 text-sm font-semibold text-white !no-underline`}
            onClick={Export}
          >
            ดาวน์โหลด
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

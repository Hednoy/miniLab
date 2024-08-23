import React, { FC, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Label, Select } from "flowbite-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { format } from "date-fns";

import CustomDatePicker from "@/components/Datepicker/CustomDatePicker";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import axiosInstance from "@/lib-client/react-query/axios";
import { Routes } from "@/lib-client/constants";
import {
  useTestTypeAll,
  useTestTypeById,
} from "@/lib-client/react-query/test-type";
import { usePathogens, usePathogensByTestTypeId } from "@/lib-client/react-query/pathogens";

const Dashboard: FC = () => {
  const { push } = useRouter();
  const { data: testTypeData } = useTestTypeAll();
  const [textSearch, setTextSearch] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [chartData, setChartData] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    dateStart: "",
    dateEnd: "",
    testTypeId: "",
    result: "",
  });
  const { data: pathogensDataType } = usePathogensByTestTypeId(Number(filter.testTypeId));
  const { data: testTypeDataById } = useTestTypeById(Number(filter.testTypeId));

  const refs = {
    dateStart: useRef<any>(),
    dateEnd: useRef<any>(),
    test_type_id: useRef<any>(),
  };

  const updateChartData = (dashboardChart: any) => {
    const chartEntries = [
      {
        name: "Detected",
        value: dashboardChart?.detected,
        percentage: dashboardChart?.detected_percentage,
      },
      {
        name: "Not Detected",
        value: dashboardChart?.not_detected,
        percentage: dashboardChart?.not_detected_percentage,
      },
      {
        name: "Positive",
        value: dashboardChart?.positive,
        percentage: dashboardChart?.positive_percentage,
      },
      {
        name: "Negative",
        value: dashboardChart?.negative,
        percentage: dashboardChart?.negative_percentage,
      },
      {
        name: "Indeterminate",
        value: dashboardChart?.indeterminate,
        percentage: dashboardChart?.indeterminate_percentage,
      },
      {
        name: "Borderline",
        value: dashboardChart?.borderline,
        percentage: dashboardChart?.borderline_percentage,
      },
    ];
    setChartData(chartEntries.filter((entry) => entry.value !== undefined));
  };

  useEffect(() => {
    const fetchDashboardChart = async () => {
      try {
        const response = await axiosInstance.get<any>(
          Routes.API.DASHBOARD_CHART,
          {
            params: { month: Number(month) },
          }
        );
        updateChartData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const currentMonth = new Date().getMonth() + 1;
    const startDate = format(
      new Date(new Date().getFullYear(), month - 1, 1),
      "yyyy-MM-dd'T'HH:mm:ss'Z'"
    );
    const endDate = format(
      month === currentMonth
        ? new Date()
        : new Date(new Date().getFullYear(), month, 0),
      "yyyy-MM-dd'T'HH:mm:ss'Z'"
    );

    setFilter({ ...filter, dateStart: startDate, dateEnd: endDate });
    fetchDashboardChart();
  }, [month]);

  const handleSearch = () => {
    push(
      `/dashboard/view?dateStart=${filter.dateStart}&dateEnd=${filter.dateEnd}&textSearch=${textSearch}&test_type_id=${filter.testTypeId}&result=${filter.result}`
    );
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get<any>(
        Routes.API.DASHBOARD_REPORT,
        {
          params: {
            page: 1,
            dateStart: filter.dateStart,
            dateEnd: filter.dateEnd,
            test_type_id: Number(filter.testTypeId),
            result: filter.result,
          },
        }
      );

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
    } catch (error) {
      swal.fire({
        title: "พบข้อผิดพลาด",
        icon: "error",
        iconHtml: customIcons.error,
      });
    }
  };

  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  const COLORS = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
  ];

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-col">
        {payload.map((entry: any, index: any) => (
          <div className="flex items-center gap-1" key={`item-${index}`}>
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <div className="flex gap-2">
              <p>
                {entry.value} : {entry.payload.value} คน
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

  const {
    register,
    control,
    formState: { errors },
  } = useForm();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          Dashboard
        </div>
        <div className="relative">
          <input
            type="text"
            id="table-search"
            placeholder="ค้นหา"
            className="border-gray-300 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400 block w-full max-w-80 rounded-lg border p-2 pe-10 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            onChange={(e) => setTextSearch(e.currentTarget.value)}
            value={textSearch}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pe-3">
            <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-[20px] p-6 shadow-sm shadow-primary">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p>
            หน้าภาพรวมการตรวจทางห้องปฏิบัติการ : {testTypeDataById?.prefix_name}
          </p>
        </div>

        <div className="mb-2 flex flex-wrap gap-3">
          <div className="flex-1">
            <Label
              htmlFor={`lab_tests.test_type_id`}
              value={`รายการตรวจวิเคราะห์`}
            />
            <Controller
              name="test_type_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...register("test_type_id")}
                  mainKeyId="id"
                  mainKey="prefix_name"
                  value={field.value}
                  ref={refs.test_type_id}
                  option={testTypeData}
                  onChange={(val: any) => {
                    field.onChange(val);
                    setFilter({ ...filter, testTypeId: val });
                  }}
                />
              )}
            />
          </div>

          <div className="flex-1">
            <Label htmlFor={`lab_tests.pathogens_id`} value={`Pathogens`} />
            <Controller
              name={`lab_tests.pathogens_id`}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...register(`lab_tests.pathogens_id`)}
                  mainKeyId="id"
                  mainKey="name"
                  value={field.value}
                  option={pathogensDataType}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />
            <div className="mt-4 text-start">
              {errors?.[`lab_tests.pathogens_id`] && (
                <p className="text-red-500">
                  {String(errors?.[`lab_tests.pathogens_id`]?.message)}
                </p>
              )}
            </div>
          </div>

          <div className="flex-1">
            <Label htmlFor={`startDate`} value={`ตั้งแต่`} />
            <CustomDatePicker
              ref={refs.dateStart}
              onChange={(selectDate: string) =>
                setFilter({ ...filter, dateStart: selectDate })
              }
              value={filter.dateStart ? new Date(filter.dateStart) : null}
            />
          </div>

          <div className="flex-1">
            <Label htmlFor={`endDate`} value={`ถึง`} />
            <CustomDatePicker
              ref={refs.dateEnd}
              onChange={(selectDate: string) =>
                setFilter({ ...filter, dateEnd: selectDate })
              }
              value={filter.dateEnd ? new Date(filter.dateEnd) : null}
            />
          </div>
        </div>

        <ResponsiveContainer width={"100%"} height={400}>
          <PieChart>
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
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          เรียกดูข้อมูล
        </div>
      </div>

      <div className="mb-6 rounded-[20px] p-6 shadow-sm shadow-primary">
        <div className="mb-6 flex flex-wrap justify-between gap-3">
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <Label htmlFor="dateStart" value={`วันที่เริ่มต้น`} />
              <CustomDatePicker
                ref={refs.dateStart}
                onChange={(selectDate: string) =>
                  setFilter({ ...filter, dateStart: selectDate })
                }
                value={filter.dateStart ? new Date(filter.dateStart) : null}
              />
            </div>
            <p className="pb-2">จนถึง</p>
            <div>
              <Label htmlFor="dateEnd" value={`วันที่สิ้นสุด`} />
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
              <Label htmlFor="test_type_id" value={`โปรแกรมรายการตรวจ`} />
              <Select
                id="test_type_id"
                value={filter.testTypeId}
                onChange={(e) =>
                  setFilter({ ...filter, testTypeId: e.currentTarget.value })
                }
              >
                <option value="0">ทั้งหมด</option>
                {testTypeData?.map((item: any, index: number) => (
                  <option value={item.id} key={index}>
                    {item.prefix_name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="test_result" value={`ผลทดสอบ`} />
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
            className="rounded-[5px] bg-primary px-4 py-2 text-sm font-semibold text-white"
            onClick={handleSearch}
          >
            เรียกดู
          </button>
          <button
            type="button"
            className="rounded-[5px] bg-primary-pink px-4 py-2 text-sm font-semibold text-white"
            onClick={handleExport}
          >
            ดาวน์โหลด
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

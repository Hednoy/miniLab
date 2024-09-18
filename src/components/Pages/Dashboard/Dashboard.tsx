import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Label, Select } from "flowbite-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  LabelList,
  Tooltip,
} from "recharts";
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
import {
  usePathogens,
  usePathogensById,
  usePathogensByTestTypeId,
} from "@/lib-client/react-query/pathogens";
import { useDashboardChartPathogens } from "@/lib-client/react-query/dashboard";
import { data } from "@/components/DashBoardComponents/ReportChart";

const Dashboard: FC = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const { push } = useRouter();
  const { data: testTypeData } = useTestTypeAll();
  const [textSearch, setTextSearch] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [filter, setFilter] = useState({
    dateStart: "",
    dateEnd: "",
    testTypeId: "",
    result: "",
  });
  const [pathogens, setPathogens] = useState<string>("");
  const testTypeIds = watch("test_type_id");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { data: testTypeDataById } = useTestTypeById(Number(testTypeIds));
  const { data: pathogensDataType } = usePathogensByTestTypeId(
    Number(testTypeIds)
  );
  const { data: dashboardChartPathogens, isSuccess } =
    useDashboardChartPathogens({
      test_type_id: Number(testTypeIds) || 0,
      pathogensId: Number(pathogens) || 0,
      startDate:
        startDate ||
        format(
          new Date(new Date().getFullYear(), month - 1, 1),
          "yyyy-MM-dd'T'HH:mm:ss'Z'"
        ),
      endDate:
        endDate ||
        format(
          new Date(new Date().getFullYear(), month, 0),
          "yyyy-MM-dd'T'HH:mm:ss'Z'"
        ),
    });
  const refs = {
    dateStart: useRef<any>(),
    dateEnd: useRef<any>(),
    test_type_id: useRef<any>(),
  };

  const { data: pathogensList } = usePathogens({
    limit: 100,
    page: 1,
  });

  const pathogensId = Number(pathogens);
  const { data: pathogensLists } = usePathogensById(pathogensId);
  const [chartData, setChartData] = useState<
    { name: string; value: any; percentage: number }[]
  >([]);
  useEffect(() => {
    const data = Object.keys(dashboardChartPathogens || {})
      .filter((f) => f != "total")
      .map((item) => {
        return {
          name: pathogensList?.find((f) => `${f.id}` === item)?.name || "",
          value: dashboardChartPathogens?.[item],
          percentage:
            (dashboardChartPathogens?.[item] / dashboardChartPathogens?.total) *
            100,
        };
      });
    setChartData(data);
    if (pathogensLists) {
      console.log(pathogensLists.name);
    }
  }, [dashboardChartPathogens, pathogensList]);

  const filteredChartData =
    pathogensId && pathogensLists !== undefined
      ? chartData.filter((data) => data.name == pathogensLists.name)
      : chartData.filter((data) => data.percentage > 4);
  const filteredChartDataTable =
    pathogensId && pathogensLists !== undefined
      ? chartData.filter((data) => data.name == pathogensLists.name)
      : chartData;

  useEffect(() => {
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

  const generateColor = (index: number, total: number) => {
    const hue = (index * (360 / total)) % 360;
    const saturation = 70;
    const lightness = 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const generateUniqueColors = (dataLength: number) => {
    return Array.from({ length: dataLength }, (_, index) =>
      generateColor(index, dataLength)
    );
  };

  const COLORS = useMemo(
    () => generateUniqueColors(chartData.length),
    [chartData.length]
  );
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded border bg-white p-2 shadow-sm">
          <p className="font-semibold text-primary">
            {payload[0].name || "อื่นๆ"}
          </p>
          <p>จำนวน: {payload[0].value} ครั้ง</p>
          <p>คิดเป็น: {payload[0].payload.percentage.toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center p-4">
          <p className="text-gray-500 text-lg font-semibold">
            No data available
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col">
        <table className="dashboard rounded border-4 border-primary">
          <thead className="rounded border-4 border-primary">
            <tr className="text-left">
              <th>Pathogens</th>
              <th>จำนวน</th>
              <th>คิดเป็น</th>
            </tr>
          </thead>
          <tbody>
            {filteredChartDataTable.map((entry, index) => (
              <tr key={index} className="rounded border-2 border-primary">
                <td className="truncate rounded border-2 border-primary">
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      backgroundColor: COLORS[index % COLORS.length],
                      marginRight: "8px",
                    }}
                  ></span>
                  {entry.name || "อื่นๆ"}
                </td>
                <td className="truncate">{entry.value} ครั้ง</td>
                <td className="truncate text-primary">
                  (คิดเป็น {entry.percentage.toFixed(2)}%)
                </td>
              </tr>
            ))}
            <tr className="rounded border-2 border-primary font-semibold">
              <td className="truncate rounded border-2 border-primary">
                รวมทั้งหมด
              </td>
              <td className="truncate">
                {filteredChartDataTable.reduce(
                  (acc, entry) => acc + entry.value,
                  0
                )}{" "}
                ครั้ง
              </td>
              <td className="truncate text-primary"></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const handlePathogensChange = (val: any) => {
    setPathogens(val);
  };

  const [containerHeight, setContainerHeight] = useState(400);

  useEffect(() => {
    const newHeight =
      filteredChartData.length < 10
        ? 500 + filteredChartData.length * 50
        : 400 + filteredChartData.length * 25;
    setContainerHeight(newHeight);
  }, [filteredChartData]);

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
            <div className="flex-1 min-w-[200px]">
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
                }}
              />
              )}
            />
            </div>

            <div className="flex-1 min-w-[200px]">
            <Label htmlFor={`pathogens_id`} value={`Pathogens`} />
            <Controller
              name={`pathogens_id`}
              control={control}
              render={({ field }) => (
              <CustomSelect
                {...register(`pathogens_id`)}
                mainKeyId="id"
                mainKey="name"
                value={field.value}
                option={pathogensDataType}
                onChange={(val) => {
                field.onChange(val);
                handlePathogensChange(val);
                }}
              />
              )}
            />
            <div className="mt-4 text-start">
              {errors?.[`pathogens_id`] && (
              <p className="text-red-500">
                {String(errors?.[`pathogens_id`]?.message)}
              </p>
              )}
            </div>
            </div>

            <div className="flex-1 min-w-[200px]">
            <Label htmlFor={`startDate`} value={`วันที่เริ่มต้น`} />
            <CustomDatePicker
              ref={refs.dateStart}
              onChange={(selectDate: string) => setStartDate(selectDate)}
              value={startDate ? new Date(startDate) : null}
              placeholder={format(
              new Date(new Date().getFullYear(), month - 1, 1),
              "dd-MM-Y"
              )}
            />
            </div>
            <div className="flex-1 min-w-[200px]">
            <Label htmlFor={`endDate`} value={`วันที่สิ้นสุด`} />
            <CustomDatePicker
              ref={refs.dateEnd}
              onChange={(selectDate: string) => setEndDate(selectDate)}
              value={endDate ? new Date(endDate) : null}
              placeholder={format(
              new Date(new Date().getFullYear(), month, 0),
              "dd-MM-Y"
              )}
            />
            </div>
        </div>

        <ResponsiveContainer width="100%" height={containerHeight}>
          <PieChart>
            <Pie
              data={filteredChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={window.innerWidth < 768 ? 30 : 100}
              outerRadius={window.innerWidth < 768 ? 50 : 140}
              paddingAngle={2}
              labelLine={true}
              label={({ name, percentage }) =>
              `${name} (${percentage.toFixed(1)}%)`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={renderLegend}
              align="right"
              verticalAlign="bottom"
              layout="horizontal"
              iconType="circle"
              wrapperStyle={{
                maxHeight: "30%",
                overflowY: "scroll",
                marginBottom: "3%",
              }}
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

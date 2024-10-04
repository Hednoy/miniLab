import CustomDatePicker from "@/components/Datepicker/CustomDatePicker";
import { Pagination } from "@/components/Table";
import Table from "@/components/Table/Table";
import { useDashboard } from "@/lib-client/react-query/dashboard";
import { useTestTypeAll } from "@/lib-client/react-query/test-type";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Label, Select } from "flowbite-react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib-client/react-query/axios";
import { Routes } from "@/lib-client/constants";
import Papa from "papaparse";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { convertToThaiFormat } from "@/utils";
import * as XLSX from "xlsx";
import { format } from "date-fns";

const DashboardView: FC = () => {
  const searchParams = useSearchParams();
  const textParam = searchParams?.get("textSearch");
  const dateStartParam = searchParams?.get("dateStart");
  const dateEndParam = searchParams?.get("dateEnd");
  const testParam = searchParams?.get("test_type_id");
  const resultParam = searchParams?.get("result");

  const [textSearch, setTextSearch] = useState(textParam ?? "");
  const [isSearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    Number(process.env.NEXT_PUBLIC_PAGE_SIZE)
  );
  const { push } = useRouter();
  const [filter, setFilter] = useState({
    dateStart: dateStartParam ?? "",
    dateEnd: dateEndParam ?? "",
    testTypeId: testParam ?? "",
    result: resultParam ?? "",
  });
  // console.log("filter", filter);
  const { data: testtypeAll } = useTestTypeAll();
  const [sorting, setSorting] = React.useState<SortingState>([
    { desc: true, id: "created_at" },
  ]);
  const {
    data: dashboardData,
    pagination,
    isLoading,
    refetch,
  } = useDashboard(
    {
      page: currentPage,
      limit: pageSize,
      searchTerm: textSearch,
      dateStart: filter.dateStart,
      dateEnd: filter.dateEnd,
      test_type_id: Number(filter.testTypeId),
      result: filter.result,
      sortDirection: sorting[0]?.desc ? "desc" : "asc",
      sort: sorting[0]?.id ? sorting[0].id : "created_at",
    },
    isSearch
  );
  useEffect(() => {
    refetch();
  }, [filter, currentPage, sorting, textSearch]);

  const columns = useMemo<ColumnDef<(typeof dashboardData)[0]>[]>(
    () => [
      {
        accessorKey: "index",
        header: "ลำดับ",
        size: 3,
        cell: ({ row }) => {
          return <p className="text-center text-black">{row.index + 1}</p>;
        },
        enableSorting: false,
      },
      {
        accessorKey: "created_at",
        header: "วัน/เดือน/ปี",
        cell: ({ row }) => {
          return (
            <p className="text-gray">
              {row.original.created_at
                ? convertToThaiFormat(
                    format(new Date(row.original.created_at), "dd/MM/yyyy")
                  )
                : convertToThaiFormat(format(new Date(), "dd/MM/yyyy"))}
            </p>
          );
        },
      },
      {
        accessorKey: "fullname",
        header: "ชื่อ-นามสกุล",
        enableSorting: false,
      },
      {
        accessorKey: "gender",
        header: "เพศ",
        cell: ({ row }) => (
          <p className="line-clamp-1 text-black">
            {row.original.gender == "MALE" ? "ชาย" : "หญิง"}
          </p>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "age",
        header: "อายุ",
        enableSorting: false,
      },
      {
        accessorKey: "case_no",
        header: "Lab number",
      },
      {
        accessorKey: "hospital_name",
        header: "หน่วยงาน",
      },
      {
        accessorKey: "id_cad",
        header: "เลขประจำตัวประชาชน",
        cell: ({ row }) => (
          <p className="line-clamp-1 text-primary">{row.original.id_cad}</p>
        ),
      },
      {
        accessorKey: "prefix_name",
        header: "โปรแกรมรายการตรวจ",
        size: 300,
        minSize: 300,
        enableSorting: false,
      },
      {
        accessorKey: "subfix_name",
        header: "หลักการตรวจ",
        enableSorting: false,
      },
      {
        accessorKey: "result",
        header: "ผลทดสอบ",
      },
      {
        header: "",
        accessorKey: "id",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3 text-primary">
              <button
                type="button"
                onClick={() =>
                  push("/laboratory/" + row.original.id + "?state=view")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_12_3783)">
                    <path
                      d="M7.33333 2.66675H2.66666C2.31304 2.66675 1.9739 2.80722 1.72385 3.05727C1.4738 3.30732 1.33333 3.64646 1.33333 4.00008V13.3334C1.33333 13.687 1.4738 14.0262 1.72385 14.2762C1.9739 14.5263 2.31304 14.6667 2.66666 14.6667H12C12.3536 14.6667 12.6928 14.5263 12.9428 14.2762C13.1929 14.0262 13.3333 13.687 13.3333 13.3334V8.66675"
                      stroke="#1DA7B4"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.3333 1.66665C12.5985 1.40144 12.9583 1.25244 13.3333 1.25244C13.7084 1.25244 14.0681 1.40144 14.3333 1.66665C14.5985 1.93187 14.7475 2.29158 14.7475 2.66665C14.7475 3.04173 14.5985 3.40144 14.3333 3.66665L7.99999 9.99999L5.33333 10.6667L5.99999 7.99999L12.3333 1.66665Z"
                      stroke="#1DA7B4"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_12_3783">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>

              {/* <button type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M1.99999 4H14"
                    stroke="#1DA7B4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.6667 3.99992V13.3333C12.6667 13.6869 12.5262 14.026 12.2761 14.2761C12.0261 14.5261 11.6869 14.6666 11.3333 14.6666H4.66666C4.31304 14.6666 3.9739 14.5261 3.72385 14.2761C3.4738 14.026 3.33333 13.6869 3.33333 13.3333V3.99992M5.33333 3.99992V2.66659C5.33333 2.31296 5.4738 1.97382 5.72385 1.72378C5.9739 1.47373 6.31304 1.33325 6.66666 1.33325H9.33333C9.68695 1.33325 10.0261 1.47373 10.2761 1.72378C10.5262 1.97382 10.6667 2.31296 10.6667 2.66659V3.99992"
                    stroke="#1DA7B4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button> */}
            </div>
          );
        },
      },
    ],
    []
  );

  async function Export() {
    const params = {
      page: 1,
      dateStart: filter.dateStart,
      dateEnd: filter.dateEnd,
      test_type_id: Number(filter.testTypeId),
      result: filter.result,
    };

    try {
      // Show loading alert
      swal.fire({
        title: "กำลังดาวน์โหลด...",
        text: "กรุณารอสักครู่",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          swal.showLoading();
        },
      });

      const response = await axiosInstance.get<any>(
        Routes.API.DASHBOARD_REPORT,
        { params }
      );
      const parsedData = Papa.parse(response.data, { header: true }).data;

      if (parsedData.length > 100000) {
        swal.close();
        swal.fire({
          title: "ข้อจำกัดการดาวน์โหลด",
          text: "กรุณาดาวน์โหลดข้อมูลที่มีน้อยกว่า 100,000 แถว",
          icon: "warning",
          iconHtml: customIcons.warning,
        });
        return;
      }

      const wb = XLSX.utils.book_new();
      const chunkSize = 20000;
      let sheetIndex = 0;

      for (let i = 0; i < parsedData.length; i += chunkSize) {
        const chunk = parsedData.slice(i, i + chunkSize);
        const ws = XLSX.utils.json_to_sheet(chunk);
        XLSX.utils.book_append_sheet(wb, ws, `ข้อมูลชุดที่ ${++sheetIndex}`);
      }

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

      // Close loading alert
      swal.close();
    } catch (error) {
      // Close loading alert and show error alert
      swal.close();
      swal.fire({
        title: "พบข้อผิดพลาด",
        icon: "error",
        iconHtml: customIcons.error,
      });
    }
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

  // async function Export() {
  //   await axiosInstance
  //     .get<any>(Routes.API.DASHBOARD_REPORT, {
  //       params: {
  //         page: currentPage,
  //         dateStart: filter.dateStart,
  //         dateEnd: filter.dateEnd,
  //         test_type_id: Number(filter.testTypeId),
  //         result: filter.result,
  //       },
  //     })
  //     .then((response) => {
  //       // Parse CSV data
  //       const parsedData = Papa.parse(response.data, { header: true });

  //       // Convert parsed data to CSV format
  //       const csvContent = Papa.unparse(parsedData.data, { header: true });

  //       // Create a Blob containing the CSV data
  //       const blob = new Blob([csvContent], {
  //         type: "text/csv; charset=utf-8",
  //       });

  //       // Create a temporary anchor element
  //       const link = document.createElement("a");
  //       link.href = window.URL.createObjectURL(blob);
  //       link.download = "Database LAB IUDC";

  //       // Programmatically click the link to trigger the download
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

  async function Search() {
    setIsSearch(true);
    refetch();
    setIsSearch(false);
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary ">
          เรียกดูข้อมูล
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
        <div className="mb-6 flex flex-wrap justify-between gap-3">
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <div className="block">
                <Label htmlFor="dateStart" value={`วันที่เริ่มต้น`} />
              </div>
              <CustomDatePicker
                onChange={(selectDate: string) =>
                  setFilter({ ...filter, dateStart: selectDate })
                }
                value={filter.dateStart ? new Date(filter.dateStart) : null}
              />
            </div>
            <p className="pb-2">จนถึง</p>
            <div>
              <div className="block">
                <Label htmlFor="dateEnd" value={`วันที่สิ้นสุด`} />
              </div>
              <CustomDatePicker
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
                onChange={(e) => {
                  setFilter({ ...filter, result: e.currentTarget.value });
                }}
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

      <div className="rounded-[20px] p-6 shadow-sm shadow-primary">
        <div className="mb-6 flex justify-between">
          <div className="flex gap-2">
            <p>รายการทั้งหมด</p>
            <p className="text-primary">({pagination?.total} รายการ)</p>
          </div>
        </div>

        {/* <div className="overflow-x-auto"> */}
        <Table
          columns={columns}
          data={dashboardData}
          pagination={{
            pageIndex: pagination?.currentPage ?? 0,
            pageSize: pageSize,
          }}
          PageCount={pagination?.pagesCount ?? 0}
          ShowPagination={false}
          sorting={sorting}
          setSorting={setSorting}
        />

        <div className="flex justify-end">
          <Pagination
            page={currentPage}
            totalPage={pagination?.pagesCount ?? 0}
            setPage={function (value: React.SetStateAction<number>): void {
              setCurrentPage(value);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardView;

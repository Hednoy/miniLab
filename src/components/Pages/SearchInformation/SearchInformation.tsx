"use client";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { Pagination } from "@/components/Table";
import Table from "@/components/Table/Table";
import { Routes } from "@/lib-client/constants";
import { useDeleteLabById, useLabs } from "@/lib-client/react-query/lab";
import {
  useTestTypeAll,
  useTestTypes,
} from "@/lib-client/react-query/test-type";
import { convertToThaiFormatTime } from "@/utils";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TestType } from "@prisma/client";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { Dropdown, Select } from "flowbite-react";
import _ from "lodash";
import { useRouter } from "next/navigation";
import React, { FC, useMemo, useState } from "react";

const SearchInformation: FC = () => {
  const [textSearch, setTextSearch] = useState("");
  const [showBy, setShowBy] = useState("list");
  const [currentLabsPage, setCurrentLabsPage] = useState<number>(1);
  const [currentTestTypePage, setCurrentTestTypePage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    Number(process.env.NEXT_PUBLIC_PAGE_SIZE)
  );
  const { push } = useRouter();
  const { data: testtypeAll } = useTestTypeAll();

  const [selectedTestType, setSelectedTestType] = useState("0");
  const [selectedTestTypeText, setSelectedTestTypeText] = useState("");
  const [sorting, setSorting] = React.useState<SortingState>([
    { desc: true, id: "created_at" },
  ]);
  const {
    data: labsData,
    pagination: paginationLabs,
    isLoading: isLoadingLabs,
  } = useLabs({
    page: currentLabsPage,
    limit: pageSize,
    searchTerm: textSearch,
    test_type_id: selectedTestType ? Number(selectedTestType) : 0,
    sortDirection: sorting[0]?.desc ? "desc" : "asc",
    sort: sorting[0]?.id ? sorting[0].id : "created_at",
  });

  const {
    data: testTypesData,
    pagination: paginationTestType,
    isLoading: isLoadingTestType,
  } = useTestTypes({
    page: currentTestTypePage,
    limit: 12,
  });

  async function ExportPDF_ICN(id: number, case_no: string) {
    const response = await fetch(`${Routes.API.LAB}/${id}/pdf-icn`);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.onload = () => {
        // printWindow.print();
      };
    } else {
      swal.fire({
        title: "พบข้อผิดพลาด",
        icon: "success",
        iconHtml: customIcons.error,
      });
    }
  }

  async function ExportPDF_FM(id: number, case_no: string) {
    const response = await fetch(`${Routes.API.LAB}/${id}/pdf-fm`);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.onload = () => {
        // printWindow.print();
      };
    } else {
      swal.fire({
        title: "พบข้อผิดพลาด",
        icon: "success",
        iconHtml: customIcons.error,
      });
    }
  }

  const { mutate: deleteLabById, isPending } = useDeleteLabById();

  const columns = useMemo<ColumnDef<(typeof labsData)[0]>[]>(
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
        header: "วันที่",
        cell: ({ row }) => (
          <p className="font-medium text-gray">
            {row.original?.created_at &&
              convertToThaiFormatTime(
                format(new Date(row.original?.created_at), "dd/MM/yyyy HH:mm")
              )}
          </p>
        ),
      },
      {
        accessorKey: "case_no",
        header: "Lab Number",
        cell: ({ row }) => <p className="text-black">{row.original.case_no}</p>,
      },
      {
        accessorKey: "Patient",
        header: "ชื่อ-สกุล",
        cell: ({ row }) => (
          <p className="whitespace-nowrap text-black">
            {row.original.Patient?.title} {row.original.Patient?.first_name}{" "}
            {row.original.Patient?.last_name}
          </p>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "inspection_type",
        header: "ชนิดสิ่งส่งตรวจ (Specimens)",
        enableSorting: false,
        size: 60,
        cell: ({ row }) => (
          <p className="text-black">{row.original.InspectionType?.name}</p>
        ),
      },
      {
        accessorKey: "test_type_subfix",
        header: "หลักการตรวจวิเคราะห์ (Detection Method)",
        enableSorting: false,
        maxSize: 60,
        cell: ({ row }) => (
          <p className="text-black">{row.original.TestType?.subfix_name}</p>
        ),
      },
      {
        accessorKey: "test_type_prefix",
        header: "รายการตรวจวิเคราะห์ (Test Name)",
        enableSorting: false,
        size: 200,
        cell: ({ row }) => (
          <p className="text-black">{row.original.TestType?.prefix_name}</p>
        ),
      },
      {
        accessorKey: "id",
        header: "",
        size: 50,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3 text-primary">
              <button
                type="button"
                onClick={() => {
                  if (row.original.Machine.name !== "แบบฟอร์มการรายงานผล ATK") {
                    ExportPDF_FM(row.original.id, row.original.case_no);
                    // alert("FM");
                  } else if (
                    row.original.Machine.name == "แบบฟอร์มการรายงานผล ATK"
                  ) {
                    ExportPDF_ICN(row.original.id, row.original.case_no);
                    // alert("ICN");
                  } else {
                    alert("cannot export PDF.");
                  }
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 9H9V10H5V9ZM5 6.5H11V7.5H5V6.5ZM5 11.5H7.5V12.5H5V11.5Z"
                    fill="#1DA7B4"
                  />
                  <path
                    d="M12.5 2.5H11V2C11 1.73478 10.8946 1.48043 10.7071 1.29289C10.5196 1.10536 10.2652 1 10 1H6C5.73478 1 5.48043 1.10536 5.29289 1.29289C5.10536 1.48043 5 1.73478 5 2V2.5H3.5C3.23478 2.5 2.98043 2.60536 2.79289 2.79289C2.60536 2.98043 2.5 3.23478 2.5 3.5V14C2.5 14.2652 2.60536 14.5196 2.79289 14.7071C2.98043 14.8946 3.23478 15 3.5 15H12.5C12.7652 15 13.0196 14.8946 13.2071 14.7071C13.3946 14.5196 13.5 14.2652 13.5 14V3.5C13.5 3.23478 13.3946 2.98043 13.2071 2.79289C13.0196 2.60536 12.7652 2.5 12.5 2.5ZM6 2H10V4H6V2ZM12.5 14H3.5V3.5H5V5H11V3.5H12.5V14Z"
                    fill="#1DA7B4"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => push("/laboratory/" + row.original.id)}
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
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3 border-l-4 border-primary px-3 text-base font-semibold text-primary">
          {!textSearch
            ? selectedTestTypeText
              ? selectedTestTypeText
              : "การจัดการและค้นหาข้อมูล"
            : "ค้นหา"}
          {textSearch && (
            <>
              <p className="italic text-primary-pink">
                &quot;{textSearch}&quot;
              </p>
              <p className="text-gray">ค้นพบ {paginationLabs?.total} รายการ</p>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <input
              type="text"
              id="table-search"
              placeholder="ค้นหา"
              className="border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400 block w-full max-w-80 rounded-lg border p-2 pe-10 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChange={(e) => {
                setTextSearch(e.currentTarget.value);
                setSelectedTestTypeText("");
                setSelectedTestType("0");
              }}
              value={textSearch}
            />
            <div className="rtl:inset-l-0 pointer-events-none absolute inset-y-0 right-0 flex items-center pe-3 rtl:left-0">
              <FontAwesomeIcon
                icon={faSearch}
                className="h-4 w-4 text-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`flex items-center  gap-3 ${
          showBy == "list" ? "justify-between" : "justify-end"
        }`}
      >
        {showBy == "list" && (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lightgray">รายการแสดง :</p>
            <Select
              className="max-w-60"
              id="test_type_id"
              value={selectedTestType}
              onChange={(e) => {
                setSelectedTestType(e.currentTarget.value);
                const selectedTestType = _.find(testtypeAll, {
                  id: Number(e.currentTarget.value),
                });
                if (selectedTestType)
                  setSelectedTestTypeText(selectedTestType.prefix_name);
                else setSelectedTestTypeText("");
              }}
            >
              <option value="0">ทั้งหมด</option>
              {testtypeAll.map((item: any, index: number) => (
                <option value={item.id} key={index}>
                  {item.prefix_name}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowBy("list");
              setSelectedTestTypeText("");
              setSelectedTestType("0");
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" rx="3" fill="#1DA7B4" />
              <path
                d="M7.67675 4C7.67675 3.44771 8.12446 3 8.67675 3H20C20.5523 3 21 3.44772 21 4V5.91425C21 6.46654 20.5523 6.91425 20 6.91425H8.67675C8.12446 6.91425 7.67675 6.46653 7.67675 5.91425V4ZM7.67675 11.0425C7.67675 10.4902 8.12446 10.0425 8.67675 10.0425H20C20.5523 10.0425 21 10.4902 21 11.0425V12.9567C21 13.509 20.5523 13.9567 20 13.9567H8.67675C8.12446 13.9567 7.67675 13.509 7.67675 12.9567V11.0425ZM7.67675 18.0858C7.67675 17.5335 8.12446 17.0858 8.67675 17.0858H20C20.5523 17.0858 21 17.5335 21 18.0858V20C21 20.5523 20.5523 21 20 21H8.67675C8.12446 21 7.67675 20.5523 7.67675 20V18.0858ZM3 4C3 3.44771 3.44772 3 4 3H5.39754C5.94982 3 6.39754 3.44772 6.39754 4V5.91425C6.39754 6.46654 5.94983 6.91425 5.39754 6.91425H4C3.44772 6.91425 3 6.46653 3 5.91425V4ZM3 11.0425C3 10.4902 3.44772 10.0425 4 10.0425H5.39754C5.94982 10.0425 6.39754 10.4902 6.39754 11.0425V12.9567C6.39754 13.509 5.94983 13.9567 5.39754 13.9567H4C3.44772 13.9567 3 13.509 3 12.9567V11.0425ZM3 18.0858C3 17.5335 3.44772 17.0858 4 17.0858H5.39754C5.94982 17.0858 6.39754 17.5335 6.39754 18.0858V20C6.39754 20.5523 5.94983 21 5.39754 21H4C3.44772 21 3 20.5523 3 20V18.0858Z"
                fill="white"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowBy("type");
              setSelectedTestTypeText("");
              setSelectedTestType("0");
              setTextSearch("");
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="23"
                height="23"
                rx="2.5"
                fill="white"
              />
              <rect
                x="0.5"
                y="0.5"
                width="23"
                height="23"
                rx="2.5"
                stroke="#DCF4F7"
              />
              <path
                d="M3.75 10.5005C3.55109 10.5005 3.36032 10.4214 3.21967 10.2808C3.07902 10.1401 3 9.94937 3 9.75045V3.75195C3 3.55304 3.07902 3.36228 3.21967 3.22162C3.36032 3.08097 3.55109 3.00195 3.75 3.00195H9.75C9.94891 3.00195 10.1397 3.08097 10.2803 3.22162C10.421 3.36228 10.5 3.55304 10.5 3.75195V9.75045C10.5 9.94937 10.421 10.1401 10.2803 10.2808C10.1397 10.4214 9.94891 10.5005 9.75 10.5005H3.75ZM14.25 10.5005C14.0511 10.5005 13.8603 10.4214 13.7197 10.2808C13.579 10.1401 13.5 9.94937 13.5 9.75045V3.75195C13.5 3.55304 13.579 3.36228 13.7197 3.22162C13.8603 3.08097 14.0511 3.00195 14.25 3.00195H20.2485C20.4474 3.00195 20.6382 3.08097 20.7788 3.22162C20.9195 3.36228 20.9985 3.55304 20.9985 3.75195V9.75045C20.9985 9.94937 20.9195 10.1401 20.7788 10.2808C20.6382 10.4214 20.4474 10.5005 20.2485 10.5005H14.25ZM3.75 21.0005C3.55109 21.0005 3.36032 20.9214 3.21967 20.7808C3.07902 20.6401 3 20.4494 3 20.2505V14.2505C3 14.0515 3.07902 13.8608 3.21967 13.7201C3.36032 13.5795 3.55109 13.5005 3.75 13.5005H9.75C9.94891 13.5005 10.1397 13.5795 10.2803 13.7201C10.421 13.8608 10.5 14.0515 10.5 14.2505V20.2505C10.5 20.4494 10.421 20.6401 10.2803 20.7808C10.1397 20.9214 9.94891 21.0005 9.75 21.0005H3.75ZM14.25 21.0005C14.0511 21.0005 13.8603 20.9214 13.7197 20.7808C13.579 20.6401 13.5 20.4494 13.5 20.2505V14.2505C13.5 14.0515 13.579 13.8608 13.7197 13.7201C13.8603 13.5795 14.0511 13.5005 14.25 13.5005H20.2485C20.4474 13.5005 20.6382 13.5795 20.7788 13.7201C20.9195 13.8608 20.9985 14.0515 20.9985 14.2505V20.2505C20.9985 20.4494 20.9195 20.6401 20.7788 20.7808C20.6382 20.9214 20.4474 21.0005 20.2485 21.0005H14.25Z"
                fill="#1DA7B4"
              />
            </svg>
          </button>
        </div>
      </div>

      {showBy == "list" ? (
        <>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              data={labsData}
              pagination={{
                pageIndex: paginationLabs?.currentPage ?? 0,
                pageSize: pageSize,
              }}
              PageCount={paginationLabs?.pagesCount ?? 0}
              ShowPagination={false}
              sorting={sorting}
              setSorting={setSorting}
            />
          </div>

          <div className="flex justify-end">
            <Pagination
              page={currentLabsPage}
              totalPage={paginationLabs?.pagesCount ?? 0}
              setPage={function (value: React.SetStateAction<number>): void {
                setCurrentLabsPage(value);
              }}
            />
          </div>
        </>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-3">
            {testTypesData?.length > 0 ? (
              testTypesData.map((data: TestType, index: number) => (
                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-2"
                  key={index}
                  onClick={() => {
                    setSelectedTestType(String(data.id));
                    setSelectedTestTypeText(data.prefix_name);
                    setShowBy("list");
                  }}
                >
                  <svg
                    width="93"
                    height="120"
                    viewBox="0 0 93 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M92.2031 31.6406L67.5938 24.6094L60.5625 0H11.3438C5.51883 0 0.796875 4.72195 0.796875 10.5469V109.453C0.796875 115.278 5.51883 120 11.3438 120H81.6562C87.4812 120 92.2031 115.278 92.2031 109.453V31.6406Z"
                      fill="#A4EBF3"
                    />
                    <path
                      d="M92.2031 31.6406V109.453C92.2031 115.278 87.4812 120 81.6562 120H46.5V0H60.5625L67.5938 24.6094L92.2031 31.6406Z"
                      fill="#1DA7B4"
                    />
                    <path
                      d="M92.2031 31.6406H67.5938C63.7266 31.6406 60.5625 28.4766 60.5625 24.6094V0C61.4766 0 62.3906 0.351562 63.0232 1.05492L91.1482 29.1799C91.8516 29.8125 92.2031 30.7266 92.2031 31.6406Z"
                      fill="#A4EBF3"
                    />
                    <path
                      d="M67.5938 56.4844H25.4062C23.463 56.4844 21.8906 54.912 21.8906 52.9688C21.8906 51.0255 23.463 49.4531 25.4062 49.4531H67.5938C69.537 49.4531 71.1094 51.0255 71.1094 52.9688C71.1094 54.912 69.537 56.4844 67.5938 56.4844Z"
                      fill="#FFF5F5"
                    />
                    <path
                      d="M67.5938 70.5469H25.4062C23.463 70.5469 21.8906 68.9745 21.8906 67.0312C21.8906 65.088 23.463 63.5156 25.4062 63.5156H67.5938C69.537 63.5156 71.1094 65.088 71.1094 67.0312C71.1094 68.9745 69.537 70.5469 67.5938 70.5469Z"
                      fill="#FFF5F5"
                    />
                    <path
                      d="M67.5938 84.6094H25.4062C23.463 84.6094 21.8906 83.037 21.8906 81.0938C21.8906 79.1505 23.463 77.5781 25.4062 77.5781H67.5938C69.537 77.5781 71.1094 79.1505 71.1094 81.0938C71.1094 83.037 69.537 84.6094 67.5938 84.6094Z"
                      fill="#FFF5F5"
                    />
                    <path
                      d="M53.5312 98.6719H25.4062C23.463 98.6719 21.8906 97.0995 21.8906 95.1562C21.8906 93.213 23.463 91.6406 25.4062 91.6406H53.5312C55.4745 91.6406 57.0469 93.213 57.0469 95.1562C57.0469 97.0995 55.4745 98.6719 53.5312 98.6719Z"
                      fill="#FFF5F5"
                    />
                    <path
                      d="M46.5 98.6719H53.5312C55.4745 98.6719 57.0469 97.0995 57.0469 95.1562C57.0469 93.213 55.4745 91.6406 53.5312 91.6406H46.5V98.6719Z"
                      fill="#E3E7EA"
                    />
                    <path
                      d="M46.5 84.6094H67.5938C69.537 84.6094 71.1094 83.037 71.1094 81.0938C71.1094 79.1505 69.537 77.5781 67.5938 77.5781H46.5V84.6094Z"
                      fill="#E3E7EA"
                    />
                    <path
                      d="M46.5 70.5469H67.5938C69.537 70.5469 71.1094 68.9745 71.1094 67.0312C71.1094 65.088 69.537 63.5156 67.5938 63.5156H46.5V70.5469Z"
                      fill="#E3E7EA"
                    />
                    <path
                      d="M46.5 56.4844H67.5938C69.537 56.4844 71.1094 54.912 71.1094 52.9688C71.1094 51.0255 69.537 49.4531 67.5938 49.4531H46.5V56.4844Z"
                      fill="#E3E7EA"
                    />
                  </svg>
                  <p>{data.prefix_name}</p>
                </button>
              ))
            ) : (
              <div className="w-full text-center">ไม่พบข้อมูล</div>
            )}
          </div>
          <div className="flex justify-end">
            <Pagination
              page={currentTestTypePage}
              totalPage={paginationTestType?.pagesCount ?? 0}
              setPage={function (value: React.SetStateAction<number>): void {
                setCurrentTestTypePage(value);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SearchInformation;

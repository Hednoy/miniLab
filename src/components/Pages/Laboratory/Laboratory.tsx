"use client";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { Pagination } from "@/components/Table";
import Table from "@/components/Table/Table";
import { Routes } from "@/lib-client/constants";
import axiosInstance from "@/lib-client/react-query/axios";
import { useDeleteLabById, useLabs } from "@/lib-client/react-query/lab";
import { faClipboard, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { Dropdown } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { FC, useMemo, useState } from "react";
import Papa from "papaparse";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import { convertToThaiFormat } from "@/utils";
import { format } from "date-fns";

const Laboratory: FC = () => {
  const [textSearch, setTextSearch] = useState("");
  const { push } = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    Number(process.env.NEXT_PUBLIC_PAGE_SIZE)
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    { desc: true, id: "created_at" },
  ]);
  const {
    data: labsData,
    pagination,
    isLoading,
    refetch,
  } = useLabs({
    page: currentPage,
    limit: pageSize,
    searchTerm: textSearch,
    sortDirection: sorting[0]?.desc ? "desc" : "asc",
    sort: sorting[0]?.id ? sorting[0].id : "created_at",
  });

  const { mutate: deleteLabById, isPending } = useDeleteLabById();
  const { mutate: createLog } = useCreateLogAction();

  async function DeleteLab(id: any) {
    swal
      .fire({
        title: `คุณต้องการลบข้อมูล`,
        icon: "warning",
        iconHtml: customIcons.warning,
        showDenyButton: true,
        confirmButtonText: "ใช่",
        denyButtonText: "ไม่",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          deleteLabById(id, {
            onSuccess: () => {
              createLog({ action: "ลบข้อมูลห้องปฏิบัติการ" });
              swal.fire({
                title: "ลบข้อมูลสำเร็จ",
                icon: "success",
                confirmButtonText: "ยืนยัน",
                iconHtml: customIcons.success,
              });
            },
            onError: (err: any) => {
              swal.fire({
                title: "พบข้อผิดพลาด",
                icon: "success",
                iconHtml: customIcons.error,
              });
            },
          });
        }
      });
  }

  // async function ExportPDF_ICN(id: number, case_no: string) {
  //   const response = await fetch(`${Routes.API.LAB}/${id}/pdf-icn`);
  //   const blob = await response.blob();
  //   const blobUrl = window.URL.createObjectURL(blob);
  //   const printWindow = window.open(blobUrl);
  //   if (printWindow) {
  //     printWindow.onload = () => {
  //       // printWindow.print();
  //     };
  //   } else {
  //     swal.fire({
  //       title: "พบข้อผิดพลาด",
  //       icon: "success",
  //       iconHtml: customIcons.error,
  //     });
  //   }
  // }
  async function ExportPDF_ICN(id: number, case_no: string) {
    const pdfUrl = `${Routes.API.LAB}/${id}/pdf-icn?case_no=${case_no}`;
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
          setTimeout(() => {
            printWindow.document.title = `${case_no}`;
        }, 1000);
    } else {
      swal.fire({
        title: "พบข้อผิดพลาด",
        icon: "error",
      });
    }
  }

  async function ExportPDF_FM(id: number, case_no: string) {
    const pdfUrl = `${Routes.API.LAB}/${id}/pdf-fm?case_no=${case_no}`;
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
        setTimeout(() => {
            printWindow.document.title = `${case_no}`;
        }, 1000);
    } else {
        swal.fire({
            title: "พบข้อผิดพลาด",
            icon: "error",
        });
    }
}

  // async function ExportPDF_FM(id: number, case_no: string) {
  //   const response = await fetch(`${Routes.API.LAB}/${id}/pdf-fm`);
  //   const blob = await response.blob();
  //   const blobUrl = window.URL.createObjectURL(blob);
  //   const printWindow = window.open(blobUrl);
  //   if (printWindow) {
  //     printWindow.onload = () => {
  //       // printWindow.print();
  //     };
  //   } else {
  //     swal.fire({
  //       title: "พบข้อผิดพลาด",
  //       icon: "success",
  //       iconHtml: customIcons.error,
  //     });
  //   }
  // }

  const columns = useMemo<ColumnDef<(typeof labsData)[0]>[]>(
    () => [
      {
        accessorKey: "index",
        header: "ลำดับ",
        size: 3,
        cell: ({ row }) => {
          return <p className="text-center text-black"> {row.index + 1} </p>;
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
        accessorKey: "case_no",
        header: "Lab Number",
        cell: ({ row }) => <p className="text-black">{row.original.case_no}</p>,
      },
      {
        accessorKey: "Patient",
        header: "ชื่อ-สกุล",
        enableSorting: false,
        cell: ({ row }) => (
          <p className="whitespace-nowrap text-black">
            {row.original.Patient?.title} {row.original.Patient?.first_name}{" "}
            {row.original.Patient?.last_name}{" "}
          </p>
        ),
      },
      {
        accessorKey: "inspection_type",
        header: "ชนิดสิ่งส่งตรวจ",
        enableSorting: false,
        size: 100,
        cell: ({ row }) => (
          <p className="text-black">{row.original?.InspectionType?.name}</p>
        ),
      },
      {
        accessorKey: "test_type_subfix",
        header: "หลักการตรวจวิเคราะห์",
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
        accessorKey: "machine",
        header: "แบบฟอร์ม",
        enableSorting: false,
        size: 200,
        cell: ({ row }) => (
          <p className="text-primary">{row.original.Machine.name}</p>
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

              <button type="button" onClick={() => DeleteLab(row?.original.id)}>
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
      <div className="mb-6 flex items-center justify-between">
        <div className="border-l-4 border-primary px-3 font-semibold text-primary">
          การจัดเก็บข้อมูลห้องปฏิบัติการ
        </div>
        <div className="flex gap-2">
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
              <FontAwesomeIcon
                icon={faSearch}
                className="h-4 w-4 text-primary"
              />
            </div>
          </div>
          <button
            type="button"
            className={` rounded-[5px] bg-primary px-4 py-1 text-sm font-semibold text-white !no-underline`}
            onClick={() => push("/laboratory/create")}
          >
            เพิ่มข้อมูล
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-lightgray">รายการทั้งหมด</p>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={labsData}
          pagination={{
            pageIndex: pagination?.currentPage ?? 0,
            pageSize: pageSize,
          }}
          PageCount={pagination?.pagesCount ?? 0}
          ShowPagination={false}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>

      <div className="flex justify-end">
        <Pagination
          page={currentPage}
          totalPage={pagination?.pagesCount ?? 0}
          setPage={function (value: React.SetStateAction<number>): void {
            setCurrentPage(value);
          }}
        />
      </div>
    </>
  );
};

export default Laboratory;

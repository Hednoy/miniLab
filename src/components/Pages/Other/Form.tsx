"use client";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { Pagination } from "@/components/Table";
import Table from "@/components/Table/Table";
import { useMachines } from "@/lib-client/react-query/machine";
import { faBook, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Datepicker, Select } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { FC, useMemo, useState } from "react";

const OtherForm: FC = () => {
  const [textSearch, setTextSearch] = useState("");
  const columnHelper = createColumnHelper<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    Number(process.env.NEXT_PUBLIC_PAGE_SIZE)
  );

  const { push } = useRouter();

  const {
    data: machineData,
    pagination,
    isLoading,
  } = useMachines({
    page: currentPage,
    limit: pageSize,
    searchTerm: textSearch,
  });

  async function DeleteForm(id: any) {
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
          swal
            .fire({
              title: "บันทึกสำเร็จ",
              icon: "success",
              confirmButtonText: "ยืนยัน",
              iconHtml: customIcons.success,
            })
            .then(() => {});
        }
      });
  }

  const columns = useMemo<ColumnDef<(typeof machineData)[0]>[]>(
    () => [
      {
        accessorKey: "name",
        header: "รายการ แบบฟอร์ม",
        size: 150,
        cell: ({ row }) => (
          <p className="font-medium text-black">{row.original.name}</p>
        ),
      },
      {
        accessorKey: "test_type_id",
        header: "โปรแกรมการตรวจ",
        size: 150,
        cell: ({ row }) => (
          <p className="font-medium text-black">
            {row.original.TestType.prefix_name}
          </p>
        ),
      },
      {
        accessorKey: "description",
        header: "รายละเอียดการตรวจ",
        size: 100,
        cell: ({ row }) => <p className="font-medium text-gray">รายละเอียด</p>,
      },
    ],
    []
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          แบบฟอร์ม
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
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={machineData}
          pagination={{
            pageIndex: pagination?.currentPage ?? 0,
            pageSize: pageSize,
          }}
          PageCount={pagination?.pagesCount ?? 0}
          ShowPagination={false}
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

export default OtherForm;

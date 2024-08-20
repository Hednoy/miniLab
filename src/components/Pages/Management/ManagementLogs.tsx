"use client";
import { Pagination } from "@/components/Table";
import Table from "@/components/Table/Table";
import { useLogsOfficer } from "@/lib-client/react-query/log";
import { convertToThaiFormatTime } from "@/utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { FC, useMemo, useState } from "react";

const ManagementLogs: FC = () => {
  const [textSearch, setTextSearch] = useState("");
  const columnHelper = createColumnHelper<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    Number(process.env.NEXT_PUBLIC_PAGE_SIZE)
  );
  const { push, back } = useRouter();
  const {
    data: logMemberData,
    pagination,
    isLoading,
  } = useLogsOfficer({
    page: currentPage,
    limit: pageSize,
    searchTerm: textSearch,
  });

  const columns = useMemo<ColumnDef<(typeof logMemberData)[0]>[]>(
    () => [
      {
        accessorKey: "action_at",
        header: "เวลา",
        size: 100,
        cell: ({ row }) => (
          <p className=" font-medium text-gray">
            {row.original?.action_at &&
              convertToThaiFormatTime(
                format(new Date(row.original?.action_at), "dd/MM/yyyy HH:mm")
              )}
          </p>
        ),
      },
      {
        accessorKey: "email",
        header: "อีเมล",
        size: 100,
        cell: ({ row }) => (
          <p className=" font-medium text-black">
            {row.original.Officer?.email}
          </p>
        ),
      },
      {
        accessorKey: "username",
        header: "Username",
        size: 100,
        cell: ({ row }) => (
          <p className=" font-medium text-black">
            {row.original.Officer?.member?.username}
          </p>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        size: 100,
        cell: ({ row }) => (
          <p className=" font-medium text-primary">{row.original.action}</p>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          ประวัติการเข้าใช้งาน
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={logMemberData}
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

export default ManagementLogs;

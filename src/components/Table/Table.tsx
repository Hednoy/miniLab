"use client";
import {
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect } from "react";

export type TableProps = {
  PageCount: number;
  pagination: PaginationState;
  sorting?: SortingState;
  setSearch?: (value: string) => void;
  setPagination?: (value: any) => void;
  setSorting?: (value: any) => void;
  getSortedRowModel?: any;
  columns?: any;
  data?: any;
  ShowPagination: boolean;
};

export const Table: React.FC<TableProps> = ({
  PageCount,
  sorting,
  pagination,
  setPagination,
  setSorting,
  columns,
  data,
}) => {
  useEffect(() => {}, [pagination]);

  const table = useReactTable({
    state: {
      pagination,
      sorting: sorting ?? [],
    },
    data: data ?? [],
    columns: columns ?? [],
    getCoreRowModel: getCoreRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    onSortingChange: (newSorting) => {
      setSorting && setSorting(newSorting);
    },
    onPaginationChange: (newPagination) => {
      setPagination && setPagination(newPagination);
    },
    // sort
    columnResizeDirection: "ltr",
    columnResizeMode: "onChange",
    manualPagination: true,
    pageCount: PageCount,
    defaultColumn: {
      size: 100,
    },
  });

  return (
    <div className="bg-white shadow-md">
      <div className="flex-column flex flex-wrap items-center justify-between gap-4 overflow-y-auto py-2 pb-4 sm:flex-row">
        <table className={`table-rirunraj w-full`}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="text-gray">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    colSpan={header.colSpan}
                    rowSpan={header.rowSpan}
                    className={`font-normal] whitespace-nowrap px-6 py-3`}
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel()?.rows?.length > 0 ? (
              table.getRowModel()?.rows?.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns?.length ?? 99} className="text-center">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

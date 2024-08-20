"use client";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import "./Table.css";

type Data = {
  id: number;
  profile: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
};

const TanStackTable = () => {
  const columnHelper = createColumnHelper<Data>();

  const columns: ColumnDef<Data, any>[] = [
    columnHelper.accessor("id", {
      id: "S.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "S.No",
    }),
    columnHelper.accessor("profile", {
      cell: (info) => (
        <img
          src={info?.getValue()}
          alt="..."
          className="h-10 w-10 rounded-full object-cover"
        />
      ),
      header: "Profile",
    }),
    columnHelper.accessor("firstName", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "First Name",
    }),
    columnHelper.accessor("lastName", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Last Name",
    }),
    columnHelper.accessor("age", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Age",
    }),
    columnHelper.accessor("visits", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Visits",
    }),
    columnHelper.accessor("progress", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Progress",
    }),
  ];
  const [data] = useState(() => [...[]]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns: columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex-column flex flex-wrap items-center justify-between space-y-4 pb-4 sm:flex-row sm:space-y-0">
        <div>
          <label>Search</label>
          <div className="relative">
            <div className="rtl:inset-r-0 pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3 rtl:right-0"></div>
            <input
              type="text"
              id="table-search"
              className="border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400 block w-full max-w-80 rounded-lg border p-2 ps-10 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search for items"
            />
          </div>
        </div>
      </div>
      <table className="text-gray-500 dark:text-gray-400 w-full text-left text-sm rtl:text-right">
        <thead className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-400 text-xs uppercase">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} scope="col" className="px-6 py-3">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600 border-b bg-white"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="w-4 p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td>No Recoard Found!</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* pagination */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <ul className="inline-flex h-8 -space-x-px text-sm rtl:space-x-reverse">
          {table.getCanPreviousPage() && (
            <li>
              <a
                onClick={() => {
                  table.previousPage();
                }}
                className="border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 ms-0 flex h-8 items-center justify-center rounded-s-lg border bg-white px-3 leading-tight dark:hover:text-white"
              >
                Previous
              </a>
            </li>
          )}

          {Array.from({ length: 5 }).map((item, index) => {
            const pageIndex = table.getState().pagination.pageIndex + index - 2;

            if (pageIndex + 1 <= 0 || table.getPageCount() <= pageIndex) {
              return null;
            }

            return (
              <li key={index}>
                <a
                  onClick={() => {
                    table.setPageIndex(pageIndex);
                  }}
                  className={
                    table.getState().pagination.pageIndex == pageIndex
                      ? "border-gray-300 dark:border-gray-700 dark:bg-gray-700 flex h-8 items-center justify-center border bg-blue-50 px-3 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:text-white"
                      : "border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 flex h-8 items-center justify-center border bg-white px-3 leading-tight dark:hover:text-white"
                  }
                >
                  {pageIndex + 1}
                </a>
              </li>
            );
          })}

          {table.getCanNextPage() && (
            <li>
              <a
                onClick={() => {
                  table.nextPage();
                }}
                className="border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 flex h-8 items-center justify-center rounded-e-lg border bg-white px-3 leading-tight dark:hover:text-white"
              >
                Next
              </a>
            </li>
          )}
        </ul>

        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>

        <input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className="w-16 rounded border bg-transparent p-1"
        />

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="bg-transparent p-2"
        >
          {[10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TanStackTable;

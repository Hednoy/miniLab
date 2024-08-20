"use client";
import * as React from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const mockData = [
  { name: "สำนักงานปลัดกระทรวงเกษตรและสหกรณ์", amount: 4 },
  { name: "สำนักงานเกษตรจังหวัดกาญจนบุรี [กจ]", amount: 1 },
  { name: "สำนักงานเกษตรอำเภอด่านมะขามเตี้ย [กจ]", amount: 12 },
  { name: "สำนักงานเกษตรอำเภอท่าม่วง [กจ]", amount: 47 },
  { name: "สำนักงานเกษตรอำเภอพนมทวน [กจ]", amount: 1 },
  { name: "สำนักงานเกษตรอำเภอสังขละบุรี [กจ]", amount: 12 },
  { name: "สำนักงานเกษตรอำเภอหนองปรือ [กจ]", amount: 2 },
  { name: "สำนักงานเกษตรอำเภอเมืองกาญจนบุรี [กจ]", amount: 1 },
  { name: "สำนักงานเกษตรอำเภอเลาขวัญ [กจ]", amount: 3 },
  { name: "สำนักงานเกษตรอำเภอไทรโยค [กจ]", amount: 25 },
];

type Department = {
  name: string;
  amount: number;
};

const columnHelper = createColumnHelper<Department>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    cell: (info) => info.getValue(),
  }),
];

function ReportTable() {
  const [data] = React.useState(() => [...mockData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex w-full justify-center">
      <table className="my-auto w-full border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="text-gray-800 border-b uppercase"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-4 pr-2 text-left font-medium dark:text-white"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 pb-[18px] pt-[14px] dark:text-white"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div />
    </div>
  );
}

export default ReportTable;

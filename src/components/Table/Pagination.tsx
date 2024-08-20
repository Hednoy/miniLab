"use client";

import { FC } from "react";
import { Pagination as PaginationFR } from "flowbite-react";
import "./Pagination.css";

type PaginationProps = {
  page: number;
  setPage: (val: number) => void;
  totalPage: number;
};

const Pagination: FC<PaginationProps> = ({ page, setPage, totalPage = 0 }) => {
  const PageShow = () => {
    let startPage = Math.max(1, page - 1);
    const endPage = Math.min(totalPage, startPage + 3);

    if (endPage - startPage < 3) {
      startPage = Math.max(1, endPage - 3);
    }

    return (
      <div>
        {[...Array(endPage)].map((e, i) => {
          if (startPage <= i + 1) {
            return (
              <button
                key={i + 1}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 hover:underline focus-visible:outline-0 ${
                  page == i + 1 ? "font-medium text-primary underline" : ""
                }`}
              >
                {i + 1}
              </button>
            );
          }
        })}
      </div>
    );
  };
  return (
    <div className="flex w-full items-center justify-end gap-x-4 py-5">
      {totalPage != 0 && "หน้า"}
      <PageShow />
    </div>
  );
};

export default Pagination;

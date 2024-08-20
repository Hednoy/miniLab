"use client";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { Pagination } from "@/components/Table";
import Table from "@/components/Table/Table";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import {
  useDeleteNewsById,
  useNews,
  useNewsType,
} from "@/lib-client/react-query/news";
import { convertToThaiFormat } from "@/utils";
import { faBook, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Datepicker, Select } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { FC, useMemo, useState } from "react";

const NewsCalendar: FC = () => {
  const [textSearch, setTextSearch] = useState("");
  const columnHelper = createColumnHelper<any>();
  const { push } = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    Number(process.env.NEXT_PUBLIC_PAGE_SIZE)
  );

  const [filter, setFilter] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    news_type: "",
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data: masterNewsTypeData } = useNewsType();

  const {
    data: newsData,
    pagination,
    isLoading,
  } = useNews({
    page: currentPage,
    limit: pageSize,
    searchTerm: textSearch,
    new_type_id: Number(filter.news_type),
    date: filter.date,
    sortDirection: sorting[0]?.desc ? "desc" : "asc",
    sort: sorting[0]?.id ? sorting[0].id : "date_start",
  });

  const { mutate: deleteNewsById, isPending } = useDeleteNewsById();
  const { mutate: createLog } = useCreateLogAction();

  async function DeleteNews(id: any) {
    swal
      .fire({
        title: `คุณต้องการลบข่าวสาร`,
        icon: "warning",
        iconHtml: customIcons.warning,
        showDenyButton: true,
        confirmButtonText: "ใช่",
        denyButtonText: "ไม่",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          deleteNewsById(id, {
            onSuccess: () => {
              createLog({ action: "ลบข้อมูลข่าวสาร" });
              swal.fire({
                title: "ลบข่าวสารสำเร็จ",
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

  const columns = useMemo<ColumnDef<(typeof newsData)[0]>[]>(
    () => [
      {
        accessorKey: "title",
        header: "ชื่อข่าว",
        cell: ({ row }) => (
          <p className="line-clamp-1 text-[16px] font-medium text-black">
            {row.original.title}
          </p>
        ),
        size: 20,
      },
      {
        accessorKey: "description",
        header: "รายละเอียด",
        cell: ({ row }) => (
          <p className="line-clamp-1  text-[16px] font-normal text-black">
            {row.original.description}
          </p>
        ),
        size: 200,
        enableSorting: false,
      },
      {
        accessorKey: "date_start",
        header: "วันที่",
        cell: ({ row }) => (
          <p className="text-[16px] font-medium text-primary">
            {row.original?.date_start &&
              convertToThaiFormat(
                format(new Date(row.original?.date_start), "dd/MM/yyyy")
              )}
          </p>
        ),
        size: 100,
      },
      {
        header: "",
        accessorKey: "id",
        size: 100,
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3 text-primary">
              <button
                type="button"
                onClick={() => push(`/news/detail/` + row.original.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M2.66666 12.9999C2.66666 12.5579 2.84226 12.134 3.15482 11.8214C3.46738 11.5088 3.8913 11.3333 4.33333 11.3333H13.3333"
                    stroke="#1DA7B4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.33333 1.33325H13.3333V14.6666H4.33333C3.8913 14.6666 3.46738 14.491 3.15482 14.1784C2.84226 13.8659 2.66666 13.4419 2.66666 12.9999V2.99992C2.66666 2.55789 2.84226 2.13397 3.15482 1.82141C3.46738 1.50885 3.8913 1.33325 4.33333 1.33325Z"
                    stroke="#1DA7B4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => push(`/news/` + row.original.id)}
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

              <button type="button" onClick={() => DeleteNews(row.original.id)}>
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
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          ปฏิทินข่าวสาร
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
            onClick={() => push(`/news/create`)}
          >
            เพิ่มข่าวสาร
          </button>
        </div>
      </div>

      <div className="mb-6 flex w-full justify-center">
        <Datepicker
          language="th-th"
          labelTodayButton="วันนี้"
          labelClearButton="ยกเลิก"
          inline
          defaultDate={filter.date ? new Date(filter.date) : new Date()}
          onSelectedDateChanged={(selectDate: Date) =>
            setFilter({
              ...filter,
              date: format(selectDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
            })
          }
          theme={{
            root: {
              base: "relative",
            },
            popup: {
              root: {
                base: "absolute top-10 z-50 block pt-2",
                inline: "relative top-0 z-auto",
                inner:
                  "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700",
              },
              header: {
                base: "",
                title:
                  "px-2 py-3 text-center font-semibold text-gray-900 dark:text-white",
                selectors: {
                  base: "flex justify-between mb-2",
                  button: {
                    base: "text-sm rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-semibold py-2.5 px-5 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 view-switch",
                    prev: "",
                    next: "",
                    view: "",
                  },
                },
              },
              view: {
                base: "p-1",
              },
              footer: {
                base: "flex mt-2 space-x-2",
                button: {
                  base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-cyan-300",
                  today:
                    "bg-primary text-white hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700",
                  clear:
                    "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
                },
              },
            },
            views: {
              days: {
                header: {
                  base: "grid grid-cols-7 mb-1",
                  title:
                    "dow h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400",
                },
                items: {
                  base: "grid w-64 grid-cols-7",
                  item: {
                    base: "block flex-1 cursor-pointer rounded-[9999px] border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ",
                    selected: "bg-primary text-white hover:bg-primary",
                    disabled: "text-gray-500",
                  },
                },
              },
              months: {
                items: {
                  base: "grid w-64 grid-cols-4",
                  item: {
                    base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                    selected: "bg-cyan-700 text-white hover:bg-cyan-600",
                    disabled: "text-gray-500",
                  },
                },
              },
              years: {
                items: {
                  base: "grid w-64 grid-cols-4",
                  item: {
                    base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 text-gray-900",
                    selected: "bg-cyan-700 text-white hover:bg-cyan-600",
                    disabled: "text-gray-500",
                  },
                },
              },
              decades: {
                items: {
                  base: "grid w-64 grid-cols-4",
                  item: {
                    base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9  hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 text-gray-900",
                    selected: "bg-cyan-700 text-white hover:bg-cyan-600",
                    disabled: "text-gray-500",
                  },
                },
              },
            },
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-x-3">
          <p>ประเภท :</p>
          <Select
            id="news_type"
            value={filter.news_type}
            onChange={(e) => {
              setFilter({ ...filter, news_type: e.target.value });
            }}
          >
            <option value="0">กรุณาเลือกประเภท</option>
            {masterNewsTypeData?.map((item: any, index: number) => (
              <option value={item.id} key={index}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>

        <p className="text-lightgray">เรียงจากล่าสุด</p>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={newsData}
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

export default NewsCalendar;

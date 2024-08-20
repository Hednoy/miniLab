import CustomDatePicker from "@/components/Datepicker/CustomDatePicker";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { Pagination } from "@/components/Table";
import Table from "@/components/Table/Table";
import { useDeleteNewsById } from "@/lib-client/react-query/news";
import { useNews, useNewsById } from "@/lib-client/react-query/news/useNews";
import { useNewsType } from "@/lib-client/react-query/news/useNewsType";
import { convertToThaiFormat } from "@/utils";
import { faArrowLeft, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Datepicker, Select } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

type NewsDetailProps = {
  id: number;
};

export default function NewsDetail({ id }: NewsDetailProps) {
  const { data: masterNewsTypeData } = useNewsType();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    Number(process.env.NEXT_PUBLIC_PAGE_SIZE)
  );

  const [filter, setFilter] = useState({
    date: "",
    news_type: "",
  });

  const {
    data: newsListData,
    pagination,
    isLoading: isLoadingNewsList,
  } = useNews({
    page: currentPage,
    limit: pageSize,
    new_type_id: Number(filter.news_type),
    date: filter.date,
  });

  const {
    data: newsDetail,
    isLoading,
    isSuccess,
  } = useNewsById(id, {
    enabled: !!id && !isNaN(id),
  });

  const { push, back } = useRouter();

  const columns = useMemo<ColumnDef<(typeof newsListData)[0]>[]>(
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

  const { mutate: deleteNewsById, isPending } = useDeleteNewsById();

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

  return (
    <div>
      <div className="mb-2 flex items-center justify-start">
        <div className="border-l-4 border-primary px-3">
          <p className="text-base font-semibold text-primary ">
            {newsDetail?.title}
          </p>
          <p className="text-[12px] text-gray">
            อัพโหลดเมื่อวันที่{" "}
            {newsDetail?.created_at
              ? convertToThaiFormat(
                  format(new Date(newsDetail.created_at), "dd/MM/yyyy")
                )
              : convertToThaiFormat(format(new Date(), "dd/MM/yyyy"))}
          </p>
        </div>
      </div>
      <button
        type="button"
        className="mb-6 flex items-center gap-3 text-primary"
        onClick={() => back()}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
        <p>ย้อนกลับ</p>
      </button>

      <div className="flex flex-col items-center justify-center px-3 py-10 md:px-20 md:py-20 lg:px-40 xl:px-80">
        <h1 className="mb-4 text-[24px] font-medium text-black">
          {newsDetail?.title}
        </h1>

        <p className="mb-4 text-gray">{newsDetail?.description}</p>

        {newsDetail?.images &&
          newsDetail?.images.length > 0 &&
          newsDetail?.images.map((image: any, index: number) => {
            if (
              image.file_path.split(".")[1] === "png" ||
              image.file_path.split(".")[1] === "jpg"
            ) {
              return (
                <div className="relative w-full pt-[100%]" key={index}>
                  <Image
                    src={image.file_path.replace("/public", "")}
                    alt={image.file_name}
                    objectFit="cover"
                    fill
                    className="left-0 top-0 h-full w-full rounded-2xl object-cover"
                  />
                </div>
              );
            }
          })}

        <div className="flex w-full">
          {newsDetail?.images &&
            newsDetail?.images.length > 0 &&
            newsDetail?.images.map((image: any, index: number) => {
              if (image.file_path.split(".")[1] == "pdf") {
                return (
                  <button
                    key={index}
                    className="flex items-center gap-2 rounded-[20px] bg-secondary p-2 text-sm text-primary"
                    type="button"
                    onClick={() =>
                      window.open(
                        image.file_path.replace("/public", ""),
                        "_blank"
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faFile} className="h-3 w-3" />{" "}
                    {image.file_name}
                  </button>
                );
              }
            })}
        </div>
      </div>

      <div className="mb-2 mt-5 flex flex-wrap items-center justify-start">
        <div className="border-l-4 border-primary px-3">
          <p className="text-base font-semibold text-primary ">ข่าวสารอื่นๆ</p>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-start gap-3">
          <div className="flex flex-wrap items-center gap-x-3">
            <p>ประเภท :</p>
            <Select
              id="news_type_id"
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
            <p>ประจำวันที่ :</p>
            <CustomDatePicker
              onChange={(selectDate: string) =>
                setFilter({ ...filter, date: selectDate })
              }
              value={filter.date ? new Date(filter.date) : null}
            />
          </div>

          <p className="text-lightgray">เรียงจากล่าสุด</p>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={newsListData}
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
      </div>
    </div>
  );
}

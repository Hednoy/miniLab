import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { Pagination } from "@/components/Table";
import Table from "@/components/Table/Table";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import {
  useDeleteOfficerById,
  useOfficers,
  useUpdateStatusOfficer,
} from "@/lib-client/react-query/officer";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@headlessui/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { FC, useMemo, useState } from "react";

const ManagementOfficer: FC = () => {
  const [textSearch, setTextSearch] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    Number(process.env.NEXT_PUBLIC_PAGE_SIZE)
  );
  const { push, back } = useRouter();

  const {
    data: officerData,
    pagination,
    isLoading,
  } = useOfficers({
    page: currentPage,
    limit: pageSize,
    searchTerm: textSearch,
  });

  const { mutate: deleteOfficerById, isPending } = useDeleteOfficerById();
  const { mutate: updateStatusOfficerById } = useUpdateStatusOfficer();

  const { mutate: createLog } = useCreateLogAction();

  async function UpdateStatusOfficer(id: number, status: boolean) {
    updateStatusOfficerById(
      { id, status },
      {
        onSuccess: () => {
          createLog({ action: "เปลี่ยนสถานะofficer" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            confirmButtonText: "ยืนยัน",
            iconHtml: customIcons.success,
          });
        },
        onError: (err: any) => {
          swal.fire({
            title: "พบข้อผิดพลาด",
            icon: "error",
            iconHtml: customIcons.error,
          });
        },
      }
    );
  }

  async function DeleteOfficer({
    id,
    memberId,
  }: {
    id: number;
    memberId: number;
  }) {
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
          deleteOfficerById(
            { id, memberId },
            {
              onSuccess: () => {
                createLog({ action: "ลบข้อมูลofficer" });
                swal.fire({
                  title: "บันทึกสำเร็จ",
                  icon: "success",
                  confirmButtonText: "ยืนยัน",
                  iconHtml: customIcons.success,
                });
              },
              onError: (err: any) => {
                swal.fire({
                  title: "พบข้อผิดพลาด",
                  icon: "error",
                  iconHtml: customIcons.error,
                });
              },
            }
          );
        }
      });
  }

  const columns = useMemo<ColumnDef<(typeof officerData)[0]>[]>(
    () => [
      {
        accessorKey: "member",
        header: "Username",
        size: 100,
        cell: ({ row }) => {
          return <p>{row.original.member.username}</p>;
        },
      },
      {
        accessorKey: "is_active",
        header: "",
        size: 100,
        cell: ({ row }) => {
          return (
            <Switch
              checked={row.original.is_active}
              onChange={() =>
                UpdateStatusOfficer(row.original.id, !row.original.is_active)
              }
              className={`${
                row.original.is_active ? "bg-primary" : "bg-white"
              } relative inline-flex h-6 w-11 items-center rounded-full border border-primary`}
            >
              <span
                className={`${
                  row.original.is_active
                    ? "translate-x-6 bg-white"
                    : "translate-x-1 bg-primary"
                } inline-block h-4 w-4 transform rounded-full  transition`}
              />
            </Switch>
          );
        },
      },
      {
        header: "",
        accessorKey: "id",
        size: 50,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3 text-primary">
              <button
                type="button"
                onClick={() => push(`/management/officer/${row.original.id}`)}
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

              <button
                type="button"
                onClick={() =>
                  DeleteOfficer({
                    id: row.original.id,
                    memberId: row.original.member.id,
                  })
                }
              >
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          ระบบบริหารจัดการ
        </div>
        <div className="flex flex-wrap gap-2">
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
            className={`rounded-[5px] bg-primary px-4 py-2 text-sm font-semibold text-white !no-underline`}
            onClick={() => push("/management/officer/create")}
          >
            เพิ่มผู้ใช้งาน
          </button>
          <button
            type="button"
            className={`rounded-[5px] bg-primary-pink px-4 py-2 text-sm font-semibold text-white !no-underline`}
            onClick={() => push("/management/role")}
          >
            ตำแหน่งงาน
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={officerData}
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

export default ManagementOfficer;

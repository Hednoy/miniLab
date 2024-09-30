import CustomDatePicker from "@/components/Datepicker/CustomDatePicker";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { Routes } from "@/lib-client/constants";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import {
  useCreateNews,
  useNewsById,
  useNewsType,
  useUpdateNews,
} from "@/lib-client/react-query/news";
import { UtilityUpload } from "@/lib-client/upload";
import {
  NewsCreateFormData,
  NewsGetDataForm,
  NewsUpdateForm,
} from "@/types/models/News";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { News } from "@prisma/client";
import { Datepicker, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type NewsManageProps = {
  id: number;
  data?: NewsGetDataForm;
};

export default function NewsManage({ id }: NewsManageProps): JSX.Element {
  const { data, isLoading, isSuccess } = useNewsById(id, {
    enabled: !!id && !isNaN(id),
  });

  if (!isLoading) return <NewsManageComponent id={id} data={data} />;

  return <></>;
}

function NewsManageComponent({ id, data }: NewsManageProps): JSX.Element {
  const { data: masterNewsTypeData } = useNewsType();

  const { mutate: createNews } = useCreateNews();
  const { mutate: updateNews } = useUpdateNews();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
  } = useForm<NewsCreateFormData>({
    reValidateMode: "onChange",
    values: data,
  });

  const fileRef = useRef<any>(null);

  const refs = {
    date_start: useRef<any>(),
  };

  const [file, setFile] = useState<any[]>(data?.images ? data?.images : []);

  const { push, back } = useRouter();

  // const handleFile = async (event: any) => {
  //   if (event.target && event.target.files.length > 0) {
  //     const data = await UtilityUpload(event.target.files[0]);
  //     setFile((file: any) => [...file, data]);
  //   }
  // };
  const handleFile = async (event: any) => {
    if (event.target && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files); // Convert FileList to array
      const uploadedFiles = await Promise.all(
        filesArray.map(async (file: any) => await UtilityUpload(file))
      );
      setFile((file: any) => [...file, ...uploadedFiles]);
    }
  };

  const { mutate: createLog } = useCreateLogAction();

  async function onSubmit(newsData: NewsCreateFormData) {
    newsData.type_id = Number(newsData.type_id);
    const fileList: any[] = [];
    if (file.length > 0) {
      file.map((resp, index) => {
        fileList.push({
          file_name: resp.old_file_name ? resp.old_file_name : resp.file_name,
          file_path: resp.path ? resp.path : resp.file_path,
        });
      });
    }

    newsData.images = fileList;

    if (isNaN(id)) {
      createNews(newsData, {
        onSuccess: () => {
          createLog({ action: "เพิ่มข้อมูลข่าวสาร" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.NEWS.HOME}`);
        },
        onError: (error: any) => {
          swal.fire({
            title: "พบข้อผิดพลาด",
            icon: "success",
            iconHtml: customIcons.error,
          });
        },
      });
    } else {
      const updateNewsData: NewsUpdateForm = {
        id: id,
        ...newsData,
      };
      // console.log(newsData);

      updateNews(updateNewsData, {
        onSuccess: () => {
          createLog({ action: "แก้ไขข้อมูลข่าวสาร" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.NEWS.HOME}`);
        },
        onError: (error: any) => {
          swal.fire({
            title: "พบข้อผิดพลาด",
            icon: "success",
            iconHtml: customIcons.error,
          });
        },
      });
    }
  }

  async function ExportFile(id: string, name: string) {
    const fileUrl = `${Routes.API.NEWS_IMAGES}/${id}?name=${encodeURIComponent(name)}`;
    const printWindow = window.open(fileUrl);
    if (printWindow) {
      setTimeout(() => {
        printWindow.document.title = `${name}`;
      }, 1000);
    } else {
      swal.fire({
        title: "พบข้อผิดพลาด",
        icon: "error",
      });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-start">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          เพิ่มข่าวสาร
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center px-3 py-10 md:px-20 md:py-20 lg:px-40 xl:px-80"
      >
        <div className="mb-6 grid w-full grid-cols-1 gap-3 rounded-xl p-10 shadow-sm shadow-gray">
          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="title" value={`หัวข้อข่าว`} />
            </div>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("title")}
                  id="title"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("title");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.title && (
                <p className=" text-red-500">{String(errors.title.message)}</p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="date_start" value={`วันที่`} />
            </div>
            <Controller
              name="date_start"
              control={control}
              render={({ field }) => (
                <CustomDatePicker
                  {...register("date_start")}
                  ref={refs.date_start}
                  onChange={field.onChange}
                  value={field.value || null}
                />
              )}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="name" value={`รายละเอียด`} />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...register("description")}
                  rows={6}
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("description");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.description && (
                <p className=" text-red-500">
                  {String(errors.description.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="type_id" value={`หมวดหมู่`} />
            </div>
            <Controller
              name="type_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...register("type_id")}
                  id="type_id"
                  value={String(field.value)}
                  onChange={(e) => {
                    const value =
                      e.target.value === "0" ? undefined : e.target.value;
                    field.onChange(value);
                  }}
                >
                  <option value="0">เลือกหมวดหมู่</option>
                  {masterNewsTypeData?.map((item: any, index: number) => (
                    <option value={item.id} key={index}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              )}
            />
            <div className="text-start">
              {errors.type_id && (
                <p className=" text-red-500">
                  {String(errors.type_id.message)}
                </p>
              )}
            </div>
          </div>
          <input
            type="file"
            ref={fileRef}
            accept="image/png, image/jpeg, image/jpg ,application/pdf"
            onChange={handleFile}
            multiple // Add this to allow multiple file selection
            style={{ display: "none" }}
          />
          <div className="col-span-2">
            <div className="mb-2 flex items-center gap-2">
              <Label htmlFor="file" value={`เลือกไฟล์`} />
              <p className="text-[12px] text-lightgray">
                (สามารถรองรับไฟล์เอกสาร .pdf และไฟล์รูปภาพ .jpg / .jpeg / .png)
              </p>
            </div>
            <button
              type="button"
              className={`rounded-[5px] bg-primary px-4 py-2 text-sm font-semibold text-white !no-underline`}
              onClick={() => fileRef.current.click()}
            >
              อัพโหลดไฟล์
            </button>
          </div>

          <div className="col-span-2">
            {file?.map((file: any, index: any) => (
              <div
                className="mb-2 flex items-center justify-between gap-3"
                key={index}
              >
                <div className="flex gap-2">
                  <div className="rounded-[20px] bg-secondary p-2 text-sm">
                    {file.file_name ? file.file_name : file.old_file_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary"
                      onClick={() => ExportFile(file.file_path, file.file_name)}
                      // onClick={() =>
                      //   window.open(
                      //     `/api/new-images/` + file.file_path,
                      //     "_blank"
                      //   )
                      // }
                    >
                      <FontAwesomeIcon
                        icon={faDownload}
                        className="h-3 w-3 text-white"
                      />
                    </button>

                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary-pink"
                      onClick={() =>
                        setFile((oldFile) => {
                          if (!Array.isArray(oldFile)) {
                            console.error("Old file list is not an array");
                            return oldFile;
                          }
                          return oldFile.filter((_, i) => i !== index);
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="h-3 w-3 text-white"
                      />
                    </button>
                  </div>
                </div>
                <p>{file.file_date}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
          <button
            type="button"
            className={`rounded-[5px] bg-secondary px-4 py-2 text-sm font-semibold !no-underline md:col-span-1`}
            onClick={() => back()}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className={`rounded-[5px] bg-primary px-4 py-2 text-sm font-semibold text-white !no-underline md:col-span-1`}
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}

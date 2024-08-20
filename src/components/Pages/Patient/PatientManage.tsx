import CustomDatePicker from "@/components/Datepicker/CustomDatePicker";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { useYupValidationResolver } from "@/components/hooks";
import { Routes } from "@/lib-client/constants";
import { useHospitalAll } from "@/lib-client/react-query/hospital";
import { useInspectionTypes } from "@/lib-client/react-query/inspection-type";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import { usePatientById } from "@/lib-client/react-query/patient";
import { useCreatePatient } from "@/lib-client/react-query/patient/useCreatePatient";
import { useUpdatePatient } from "@/lib-client/react-query/patient/useUpdatePatient";
import {
  PatientCreateFormData,
  PatientUpdateForm,
} from "@/types/models/Patient";
import { convertToThaiFormatTime, digitsOnly } from "@/utils";
import { Patient } from "@prisma/client";
import { TimePicker } from "antd";
import { format } from "date-fns";
import dayjs from "dayjs";
import { Checkbox, Label, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

type PatientManageProps = {
  id: number;
  data?: Patient;
};

export default function PatientManage({ id }: PatientManageProps): JSX.Element {
  const { data, isLoading } = usePatientById(id, {
    enabled: !isNaN(id),
  });

  if (!isLoading) return <PatientManageComponent id={id} data={data} />;

  return <></>;
}

function PatientManageComponent({ id, data }: PatientManageProps): JSX.Element {
  const { data: hospitalAll } = useHospitalAll();
  const { data: inspectionTypeAll } = useInspectionTypes({
    page: 1,
  });

  const { mutate: createPatient } = useCreatePatient();
  const { mutate: updatePatient } = useUpdatePatient();

  const refs = {
    date_of_birth: useRef<any>(),
    collected_date: useRef<any>(),
    received_date: useRef<any>(),
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
    trigger,
    reset,
  } = useForm<PatientCreateFormData>({
    reValidateMode: "onChange",
    values: data,
    resolver: useYupValidationResolver(
      yup.object().shape({
        title: yup.string(),
        first_name: yup.string().required("กรุณากรอกชื่อ"),
        last_name: yup.string().required("กรุณากรอกนามสกุล"),
        gender: yup.string().required("กรุณาเลือกเพศ"),
        age: yup.string(),
        is_anonymous: yup.boolean(),
        id_card: yup.string(),
        hn: yup.string(),
        an: yup.string(),
        hospital_id: yup.number(),
        case_no: yup.string().required("กรุณากรอกหมายเลข Lab number"),
        inspection_type_id: yup
          .number()
          .min(1, "กรุณาเลือกSpecimen (ชนิดสิ่งส่งตรวจ)")
          .required("กรุณาเลือกSpecimen (ชนิดสิ่งส่งตรวจ)"),
        sat_id: yup.string(),
        visit_type: yup.string(),
        date_of_birth: yup.string(),
        collected_date: yup
          .string()
          .min(1, "กรุณาเลือกวัน Collected Date")
          .required("กรุณาเลือกวัน Collected Date"),
        received_date: yup
          .string()
          .min(1, "กรุณาเลือกวัน Received Date")
          .required("กรุณาเลือกวัน Received Date"),
        phone_no: yup.string().nullable(),
      })
    ),
  });

  const { push, back } = useRouter();
  const { mutate: createLog } = useCreateLogAction();

  async function onSubmit(patienData: PatientCreateFormData) {
    if (selectedTitle === "อื่นๆ") {
      patienData.title = otherTitle;
    } else {
      patienData.title = selectedTitle;
    }
    patienData.inspection_type_id = Number(patienData.inspection_type_id);
    patienData.age = Number(patienData.age);

    const collected_time = dayjs(patienData.collected_time).format("HH:mm");
    patienData.collected_time = collected_time;
    const received_time = dayjs(patienData.received_time).format("HH:mm");
    patienData.received_time = received_time;

    if (isNaN(id)) {
      patienData.passport = "";
      createPatient(patienData, {
        onSuccess: () => {
          createLog({ action: "เพิ่มข้อมูลผู้เข้ารับบริการ" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.PATIENT.HOME}`);
        },
        onError: (error: any) => {
          swal.fire({
            title: "พบข้อผิดพลาด",
            icon: "success",
            html: error.response.data,
            iconHtml: customIcons.error,
          });
        },
      });
    } else {
      const updatePatientData: PatientUpdateForm = {
        id: id,
        ...patienData,
      };

      updatePatient(updatePatientData, {
        onSuccess: () => {
          createLog({ action: "แก้ไขข้อมูลผู้เข้ารับบริการ" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.PATIENT.HOME}`);
        },
        onError: (error: any) => {
          swal.fire({
            title: "พบข้อผิดพลาด",
            html: error.response.data,
            icon: "success",
            iconHtml: customIcons.error,
          });
        },
      });
    }
  }

  const [isAnonymous, setIsAnonymous] = useState(
    data?.is_anonymous ? true : false
  );
  const [selectedTitle, setSelectedTitle] = useState(data?.title || "");
  const [otherTitle, setOtherTitle] = useState("");

  useEffect(() => {
    setValue("is_anonymous", isAnonymous);
  }, [isAnonymous]);

  return (
    <>
      <div
        className={`flex w-full flex-wrap items-center gap-3 ${
          isNaN(id) ? "justify-start" : "justify-between"
        }`}
      >
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          {isNaN(id) ? "ลงทะเบียน" : data?.case_no}
        </div>
        {!isNaN(id) && (
          <p>
            เพิ่มข้อมูลเมื่อวันที่ :
            {data?.updated_at
              ? convertToThaiFormatTime(
                  format(new Date(data.updated_at), "dd/MM/yyyy HH:mm")
                )
              : convertToThaiFormatTime(format(new Date(), "dd/MM/yyyy HH:mm"))}
          </p>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center px-3 py-10 md:px-20 md:py-20 lg:px-40 xl:px-80"
      >
        <div className="mb-6 grid w-full grid-cols-2  gap-3 rounded-xl p-10 shadow-md shadow-gray">
          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="title" value={`คำนำหน้า`} />
            </div>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedTitle(value);
                      field.onChange(value);
                      if (value !== "อื่นๆ") {
                        setOtherTitle("");
                      }
                    }}
                    value={selectedTitle}
                    color={fieldState?.error?.message ? "failure" : undefined}
                  >
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="นาง">นาง</option>
                    <option value="อื่นๆ">อื่น ๆ</option>
                  </Select>
                  {fieldState.error?.message && (
                    <p className="text-red-500">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
            {selectedTitle === "อื่นๆ" && (
              <div className="mt-2">
                <TextInput
                  placeholder="โปรดระบุ"
                  value={otherTitle}
                  onChange={(e) => setOtherTitle(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="text-start">
              {errors.title && (
                <p className=" text-red-500">{String(errors.title.message)}</p>
              )}
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="block">
              <Label htmlFor="first_name" value={`ชื่อ (Name)`} />
            </div>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("first_name")}
                  id="first_name"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("first_name");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.first_name && (
                <p className=" text-red-500">
                  {String(errors.first_name.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="block">
              <Label htmlFor="last_name" value={`นามสกุล (Last Name)`} />
            </div>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("last_name")}
                  id="last_name"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("last_name");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.last_name && (
                <p className=" text-red-500">
                  {String(errors.last_name.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="block">
              <Label htmlFor="gender" value={`เพศ (Gender)`} />
            </div>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  {...register("gender")}
                  onChange={(value) => {
                    field.onChange(value.target.value);
                  }}
                >
                  <option value="">เลือก</option>
                  <option value="Male">ชาย</option>
                  <option value="Female">หญิง</option>
                  <option value="NotSpecified">ไม่ระบุ</option>
                </Select>
              )}
            />
            <div className="text-start">
              {errors.gender && (
                <p className=" text-red-500">{String(errors.gender.message)}</p>
              )}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="block">
              <Label htmlFor="age" value={`อายุ`} />
            </div>
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("age")}
                  id="age"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("age");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.age && (
                <p className=" text-red-500">{String(errors.age.message)}</p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex flex-row items-center gap-4">
              <Checkbox
                checked={isAnonymous}
                onChange={() => {
                  setIsAnonymous(!isAnonymous);
                }}
              />
              <p className="text-xs">
                ผู้รับบริการไม่มีข้อมูล (กรณีที่เป็นบุคคลสูญหาย,
                บุคคลข้ามชาติหรืออื่นๆ)
              </p>
            </div>
          </div>

          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="id_card" value={`เลขประจำตัวประชาชน`} />
            </div>
            <Controller
              name="id_card"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("id_card")}
                  id="id_card"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("id_card");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.id_card && (
                <p className=" text-red-500">
                  {String(errors.id_card.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="hn" value={`เลขประจำตัวผู้ป่วย(HN)`} />
            </div>
            <Controller
              name="hn"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("hn")}
                  id="hn"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("hn");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.hn && (
                <p className=" text-red-500">{String(errors.hn.message)}</p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="an" value={`เลขประจำตัวผู้ป่วยนใน(AN)`} />
            </div>
            <Controller
              name="an"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("an")}
                  id="an"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("an");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.an && (
                <p className=" text-red-500">{String(errors.an.message)}</p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="hospital" value={`หน่วยงาน (Organization)`} />
            </div>
            <Controller
              name="hospital_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...register("hospital_id")}
                  id="hospital_id"
                  value={String(field.value)}
                  onChange={(e) => {
                    field.onChange(
                      e.target.value === "0" ? undefined : e.target.value
                    );
                  }}
                >
                  <option value="0">กรุณาเลือกหน่วยงาน</option>
                  {hospitalAll.map((item: any, index: number) => (
                    <option value={item.id} key={index}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              )}
            />
            <div className="text-start">
              {errors.hospital_id && (
                <p className=" text-red-500">
                  {String(errors.hospital_id.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="block">
              <Label htmlFor="case_no" value={`Lab number`} />
            </div>
            <Controller
              name="case_no"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("case_no")}
                  id="case_no"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("case_no");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.case_no && (
                <p className=" text-red-500">
                  {String(errors.case_no.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="block">
              <Label
                htmlFor="inspection_type_id"
                value={`ชนิดสิ่งส่งตรวจ (Specimens)`}
              />
            </div>
            <Controller
              name="inspection_type_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...register("inspection_type_id")}
                  id="inspection_type_id"
                  value={String(field.value)}
                  onChange={(e) => {
                    field.onChange(
                      e.target.value === "0" ? undefined : e.target.value
                    );
                  }}
                >
                  <option value="0">กรุณาเลือกชนิดสิ่งส่งตรวจ</option>
                  {inspectionTypeAll.map((item: any, index: number) => (
                    <option value={item.id} key={index}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              )}
            />
            <div className="text-start">
              {errors.inspection_type_id && (
                <p className=" text-red-500">
                  {String(errors.inspection_type_id.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="block">
              <Label htmlFor="sat_id" value={`SAT ID`} />
            </div>
            <Controller
              name="sat_id"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("sat_id")}
                  id="sat_id"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("sat_id");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.sat_id && (
                <p className=" text-red-500">{String(errors.sat_id.message)}</p>
              )}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="block">
              <Label htmlFor="visit_type" value={`Visit Type`} />
            </div>
            <Controller
              name="visit_type"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("visit_type")}
                  id="visit_type"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("visit_type");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.visit_type && (
                <p className=" text-red-500">
                  {String(errors.visit_type.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="block">
              <Label
                htmlFor="date_of_birth"
                value={`วันเดือนปีเกิด (Date of birth)`}
              />
            </div>
            <Controller
              name="date_of_birth"
              control={control}
              render={({ field }) => (
                <CustomDatePicker
                  {...register("date_of_birth")}
                  ref={refs.date_of_birth}
                  onChange={field.onChange}
                  value={field.value || null}
                />
              )}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="block">
              <Label htmlFor="collected_date" value={`Collected Date`} />
            </div>
            <Controller
              name="collected_date"
              control={control}
              render={({ field }) => (
                <CustomDatePicker
                  {...register("collected_date")}
                  ref={refs.collected_date}
                  onChange={field.onChange}
                  value={field.value || null}
                />
              )}
            />
            <div className="text-start">
              {errors.collected_date && (
                <p className=" text-red-500">
                  {String(errors.collected_date.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="block">
              <Label htmlFor="collected_time" value={`Time`} />
            </div>
            <Controller
              name="collected_time"
              control={control}
              render={({ field }) => (
                <TimePicker
                  placeholder="เวลา"
                  defaultValue={dayjs("00:00", "HH:mm")}
                  value={field.value ? dayjs(field.value, "HH:mm") : null}
                  format={"HH:mm"}
                  onChange={field.onChange}
                />
              )}
            />
            <div className="text-start">
              {errors.collected_time && (
                <p className=" text-red-500">
                  {String(errors.collected_time.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="block">
              <Label htmlFor="received_date" value={`Received Date`} />
            </div>
            <Controller
              name="received_date"
              control={control}
              render={({ field }) => (
                <CustomDatePicker
                  {...register("received_date")}
                  ref={refs.received_date}
                  onChange={field.onChange}
                  value={field.value || null}
                />
              )}
            />
            <div className="text-start">
              {errors.collected_date && (
                <p className=" text-red-500">
                  {String(errors.collected_date.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="block">
              <Label htmlFor="received_time" value={`Time`} />
            </div>
            <Controller
              name="received_time"
              control={control}
              render={({ field }) => (
                <TimePicker
                  placeholder="เวลา"
                  defaultValue={dayjs("00:00", "HH:mm")}
                  value={field.value ? dayjs(field.value, "HH:mm") : null}
                  format={"HH:mm"}
                  onChange={field.onChange}
                />
              )}
            />
            <div className="text-start">
              {errors.received_time && (
                <p className=" text-red-500">
                  {String(errors.received_time.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2 mb-3">
            <div className="block">
              <Label htmlFor="phone_no" value={`หมายเลขโทรศัพท์`} />
            </div>
            <Controller
              name="phone_no"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...register("phone_no")}
                  id="phone_no"
                  type="text"
                  onChange={(val: any) => {
                    field.onChange(val);
                    trigger("phone_no");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.phone_no && (
                <p className=" text-red-500">
                  {String(errors.phone_no.message)}
                </p>
              )}
            </div>
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
    </>
  );
}

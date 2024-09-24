import CustomSelect from "@/components/CustomSelect/CustomSelect";
import CustomDatePicker from "@/components/Datepicker/CustomDatePicker";
import { customIcons, swal } from "@/components/Sweetalert/SweetAlert";
import { useYupValidationResolver } from "@/components/hooks";
import { Routes } from "@/lib-client/constants";
import { useDetectionMethod } from "@/lib-client/react-query/detection-method/useDetectionMethod";
import { useInspectionTypes } from "@/lib-client/react-query/inspection-type";
import { useLabById, useLabs } from "@/lib-client/react-query/lab";
import { useCreateLab } from "@/lib-client/react-query/lab/useCreateLab";
import { useUpdateLab } from "@/lib-client/react-query/lab/useUpdateLab";
import { useCreateLogAction } from "@/lib-client/react-query/log";
import { useMachines } from "@/lib-client/react-query/machine";
import { useOfficers } from "@/lib-client/react-query/officer";
import {
  usePathogens,
  usePathogensByTestTypeId,
} from "@/lib-client/react-query/pathogens";
import { usePatients } from "@/lib-client/react-query/patient";
import { useTestTypeAll } from "@/lib-client/react-query/test-type";
import { UtilityUpload } from "@/lib-client/upload";
import {
  LabCreateFormData,
  LabGetByID,
  LabUpdateForm,
} from "@/types/models/Lab";
import { LabTestCreateData } from "@/types/models/LabTest";
import { TestTypeForDD } from "@/types/models/TestType";
import { convertToThaiFormat, convertToThaiFormatTime } from "@/utils";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TimePicker } from "antd";
import { format } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import { Label, TextInput, Textarea } from "flowbite-react";
import _ from "lodash";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useWatch } from "react-hook-form";
import * as yup from "yup";
import { useSession } from "next-auth/react"; // Assuming you are using next-auth for session management
import { update } from "@/lib-server/services/users";

type LaboratoryManageProps = {
  id: number;
  state?: boolean;
  labsData?: LabGetByID;
};

export default function LaboratoryManage({ id, state }: LaboratoryManageProps) {
  const { data: labsData, isLoading } = useLabById(id, {
    enabled: !!id && !isNaN(id),
  });

  if (!isLoading)
    return (
      <LaboratoryManageComponent id={id} state={state} labsData={labsData} />
    );
  return <></>;
}

function LaboratoryManageComponent({
  id,
  state,
  labsData,
}: LaboratoryManageProps): React.JSX.Element {
  const refs = {
    case_no: useRef<any>(),
    machine_id: useRef<any>(),
    inspection_type_id: useRef<any>(),
    detection_method: useRef<any>(),
    test_type_id: useRef<any>(),
    result: useRef<any>(),
    date: useRef<any>(),
  };
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const { data: machinesData } = useMachines({});
  const { data: inspectionTypes } = useInspectionTypes({});
  const { data: detectionMethodData } = useDetectionMethod();
  const { data: testTypeData } = useTestTypeAll();
  const { data: patientsData } = usePatients({});
  const { data: pathogensData } = usePathogens({});
  const { data: officerData } = useOfficers({});
  const { data: labData } = useLabs({});
  const { mutate: createLab } = useCreateLab();
  const { mutate: updateLab } = useUpdateLab();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    trigger,
    watch,
    getValues,
    setValue,
    clearErrors,
  } = useForm<LabCreateFormData | any>({
    reValidateMode: "onChange",
    values: labsData,
    defaultValues: labsData,
    resolver: useYupValidationResolver(
      yup.object({
        case_no: yup.string().required("Lab Number"),
        machine_id: yup.number().required("กรุณาเลือกแบบฟอร์ม"),
        detection_method: yup.string().required("กรุณาเลือกหลักการตรวจ"),
        result: yup.number().required("กรุณาเลือกผลตรวจ"),
        inspection_type_id: yup.number().required("กรุณาเลือกชนิดสิ่งส่งตรวจ"),
        approve_by_id: yup.number().required("กรุณาเลือกผู้อนุมัติ"),
        approve_date: yup.string().required("กรุณาเลือกวันที่อนุมัติ"),
        approve_time: yup.string().required("กรุณาเลือกเวลาที่อนุมัติ"),
        report_by_id: yup.number().required("กรุณาเลือกผู้อนุมัติ"),
        report_date: yup.string().required("กรุณาเลือกวันที่รายงาน"),
        report_time: yup.string().required("กรุณาเลือกเวลาที่รายงาน"),
        lab_tests: yup.array().of(
          yup.object().shape({
            pathogens_id: yup.number(),
            remark: yup.string(),
            result: yup.string(),
          })
        ),
        updated_at: yup.string().required("กรุณาระบุวันที่แก้ไข"),
        count_update: yup.number().required("กรุณาระบุจำนวนการแก้ไข"),
      })
    ),
  });

  // console.log("Form values:", getValues());

  const watchFields = watch("test_type_id");
  const { data: pathogensDataType } = usePathogensByTestTypeId(watchFields);

  // const watchAllFields = watch();
  // console.log(watchAllFields);

  const filteredPatientsData = patientsData.filter(
    (patient) =>
      Array.isArray(labData) &&
      !labData.some((lab) => lab.case_no === patient.case_no)
  );
  console.log("filteredPatientsData", filteredPatientsData);
  useEffect(() => {
    if (!id) {
      const caseNo = getValues("case_no");
      const findPatient = patientsData.find((e) => e.case_no === caseNo);
      if (!findPatient || !findPatient.Lab || !findPatient.Lab[0]) {
        clearErrors("machine_id");
        setValue("machine_id", null);
        setValue("detection_method", null);
        return;
      }
      // Only set the timeout if data is found
      setTimeout(() => {
        setValue("machine_id", findPatient.Lab[0].machine_id);
        setValue("detection_method", findPatient.Lab[0].detection_method);
      }, 5000);
    }
  }, [watch("case_no")]);

  useEffect(() => {
    if (!id) {
      const caseNo = getValues("case_no");
      const findPatient = patientsData.find((e) => e.case_no === caseNo);
      if (!findPatient || !findPatient.Lab || !findPatient.Lab[0]) {
        clearErrors("detection_method");
        setValue("detection_method", null);
        return;
      }
      setTimeout(() => {
        setValue("detection_method", findPatient.Lab[0].detection_method);
      }, 5000);
    }
  }, [watch("machine_id")]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lab_tests",
  });

  const fileRef = useRef<any>(null);

  const [file, setFile] = useState<any[]>(
    labsData?.lab_attachments ? labsData?.lab_attachments : []
  );

  const handleFile = async (event: any) => {
    if (event.target && event.target.files.length > 0) {
      const data = await UtilityUpload(event.target.files[0]);
      setFile((file: any) => [...file, data]);
    }
  };

  const { push, back } = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isCanAdd, setIsCanAdd] = useState(true);

  const [formFields, setFormFields] = useState(
    labsData?.lab_tests || [{ pathogens_id: 0, result: "", remark: "" }]
  );

  const addNewRow = () => {
    if (isCanAdd) {
      setFormFields([
        ...formFields,
        { pathogens_id: 0, result: "", remark: "" },
      ]);
    }
  };

  const deleteRow = () => {
    if (formFields?.length > 1) {
      setFormFields(formFields?.slice(0, -1));
      remove(formFields.length - 1);
    }
  };

  async function SubmitForm() {
    // console.log("SubmitForm");
    let isValid = false;
    isValid = await trigger([
      "case_no",
      "machine_id",
      "result",
      "inspection_type_id",
      "detection_method",
    ]);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  }

  const { mutate: createLog } = useCreateLogAction();

  const [machineName, setMachineName] = useState("");

  useEffect(() => {
    if (watch("machine_id")) {
      const machineRows = _.find(machinesData, {
        id: Number(watch("machine_id")),
      });
      if (machineRows?.rows) {
        setMachineName(machineRows.name);
        setValue("lab_tests", []);
        for (let index = 0; index < machineRows.rows; index++) {
          if (!labsData) {
            append({
              pathogens_id: 0,
              remark: "",
              result: "",
            });
          }
        }
      }
    }
  }, [watch("machine_id")]);

  useEffect(() => {
    const currentMachineId = watch("machine_id");
    const currentMachine = _.find(machinesData, {
      id: Number(currentMachineId),
    });

    if (currentMachine) {
      setIsCanAdd(formFields?.length < currentMachine.rows);
    }
  }, [watch("machine_id"), formFields?.length, machinesData]);

  const detectionMethod = watch("detection_method");

  useEffect(() => {
    if (!detectionMethod || detectionMethod === "กรุณาเลือก") {
      clearErrors("test_type_id");
      setValue("test_type_id", "กรุณาเลือก");
      return;
    }
    const detectionMethodSelected = _.find(detectionMethodData, {
      name: detectionMethod,
    });
    if (detectionMethodSelected) {
      setTimeout(() => {
        setValue("test_type_id", detectionMethodSelected.id);
      }, 5000);
    }
  }, [watch("detection_method")]);

  const result = watch("result");
  useEffect(() => {
    if (result === 0) {
      clearErrors("result");
      setValue("result", "กรุณาเลือก");
      return;
    }
  }, [watch("result")]);

  async function onSubmit(labData: LabCreateFormData) {
    const lab: any = labData.lab_tests;
    const labtest = lab.filter(
      (obj: any) => !(obj.pathogens_id === 0 && obj.result === "")
    );
    if (labtest.length <= 0) {
      swal.fire({
        title: "กรุณาเลือกกรอกผลทดสอบ",
        icon: "success",
        iconHtml: customIcons.error,
      });
      return;
    }
    const allPossibleLabTests = pathogensDataType || [];

    const unselectedLabTests = allPossibleLabTests.filter(
      (possibleTest) =>
        !labtest.some(
          (selectedTest: any) => selectedTest.pathogens_id === possibleTest.id
        )
    );

    labData.lab_tests = labtest.concat(
      unselectedLabTests.map((test) => ({
        pathogens_id: test.id,
        result: "Not detected",
        remark: "-",
      }))
    );
    labData.inspection_type_id = Number(labData.inspection_type_id);
    labData.test_type_id = Number(labData.test_type_id);
    labData.machine_id = Number(labData.machine_id);
    labData.paper_code = "";
    labData.status = "";

    const patientSelected = _.find(patientsData, {
      case_no: labData.case_no,
    });

    if (patientSelected) {
      labData.patient_id = patientSelected.id;
      labData.hospital_id = patientSelected.hospital_id;
    }

    const report_time = dayjs(labData.report_time).format("HH:mm");
    labData.report_time = report_time;

    const approve_time = dayjs(labData.approve_time).format("HH:mm");
    labData.approve_time = approve_time;

    const fileList: any[] = [];
    if (file.length > 0) {
      file.map((resp, index) => {
        fileList.push({
          file_name: resp.old_file_name ? resp.old_file_name : resp.file_name,
          file_path: resp.path ? resp.path : resp.file_path,
          file_type: resp.file_type ? resp.file_type : resp.path.split(".")[1],
          file_size: resp.size ? resp.size : resp.file_size,
          inspection_type_id: labData.inspection_type_id,
          name: labData.case_no,
        });
      });
      labData.lab_attachments = fileList;
    }

    labData.updated_by = userId;

    if (isNaN(id)) {
      createLab(labData, {
        onSuccess: () => {
          createLog({ action: "เพิ่มข้อมูลห้องปฏิบัติการ" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.LAB.HOME}`);
        },
        onError: (error: any) => {
          console.log("error");
          swal.fire({
            title: "พบข้อผิดพลาด",
            html: error.response.data,
            icon: "success",
            iconHtml: customIcons.error,
          });
        },
      });
    } else {
      const updateLabData: LabUpdateForm = {
        id: id,
        ...labData,
      };
      updateLabData.hospital_id = null;
      updateLab(updateLabData, {
        onSuccess: () => {
          createLog({ action: "แก้ไขข้อมูลห้องปฏิบัติการ" });
          swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            iconHtml: customIcons.success,
          });
          push(`${Routes.SITE.LAB.HOME}`);
        },
        onError: () => {
          swal.fire({
            title: "พบข้อผิดพลาด",
            icon: "success",
            iconHtml: customIcons.error,
          });
        },
      });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="border-l-4 border-primary px-3 text-base font-semibold text-primary">
          การจัดเก็บข้อมูลห้องปฏิบัติการ{" "}
          {currentStep == 2 ? "- " + machineName : ""}
        </div>

        {labsData?.updated_at && (
          <div>
            เพิ่มข้อมูลเมื่อวันที่ :{" "}
            {convertToThaiFormatTime(
              format(new Date(labsData.updated_at), "dd/MM/yyyy HH:mm")
            )}
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center px-3 py-10 md:px-20 md:py-20 lg:px-40 xl:px-80"
      >
        <div
          className={`${
            currentStep !== 1 ? "hidden" : ""
          } mb-6 grid w-full grid-cols-1  gap-3 rounded-xl p-10 shadow-md shadow-gray`}
        >
          <div>
            <div className="block">
              <Label htmlFor="case_no" value={`Lab Number`} />
            </div>
            <Controller
              name="case_no"
              control={control}
              render={({ field }) => {
                return (
                  <CustomSelect
                    {...register("case_no")}
                    mainKeyId="case_no"
                    mainKey="case_no"
                    disabled={!!id || state}
                    value={field.value}
                    ref={refs.case_no}
                    option={filteredPatientsData}
                    onChange={(val: any) => {
                      field.onChange(val);
                    }}
                  />
                );
              }}
            />
            <div className="mt-4 text-start">
              {errors.case_no && (
                <p className=" text-red-500">
                  {String(errors.case_no.message)}
                </p>
              )}
            </div>
          </div>
          <div>
            <div className="block">
              <Label htmlFor="form" value={`แบบฟอร์ม`} />
            </div>
            <Controller
              name="machine_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...register("machine_id")}
                  mainKeyId="id"
                  mainKey="name"
                  value={field.value}
                  ref={refs.machine_id}
                  option={machinesData}
                  disabled={state}
                  onChange={(val: any) => {
                    field.onChange(val);
                  }}
                />
              )}
            />
            <div className="mt-4 text-start">
              {errors.machine_id && (
                <p className=" text-red-500">
                  {String(errors.machine_id.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label
                htmlFor="detection_method"
                value={`หลักการตรวจวิเคราะห์ (Detection Method)`}
              />
            </div>
            <Controller
              name="detection_method"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...register("detection_method")}
                  mainKeyId="name"
                  mainKey="name"
                  value={field.value}
                  ref={refs.detection_method}
                  option={detectionMethodData}
                  disabled={state}
                  onChange={(val: any) => {
                    field.onChange(val);
                  }}
                />
              )}
            />
            <div className="mt-4 text-start">
              {errors.detection_method && (
                <p className=" text-red-500">
                  {String(errors.detection_method.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="" value={`รายการตรวจวิเคราะห์ (Test Name)`} />
            </div>
            <Controller
              name="test_type_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...register("test_type_id")}
                  disabled
                  mainKeyId="id"
                  mainKey="subfix_name"
                  value={field.value}
                  ref={refs.test_type_id}
                  option={testTypeData}
                  onChange={(val: any) => {
                    field.onChange(val);
                  }}
                />
              )}
            />
            <div className="mt-4 text-start">
              {errors.test_type_id && (
                <p className=" text-red-500">
                  {String(errors.test_type_id.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="" value={`ผลตรวจ`} />
            </div>
            <Controller
              name="result"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...register("result")}
                  mainKeyId="value"
                  mainKey="name"
                  value={field.value}
                  ref={refs.result}
                  disabled={state}
                  option={[
                    { value: 1, name: "Detected" },
                    { value: 2, name: "Not detected" },
                    { value: 3, name: "Positive" },
                    { value: 4, name: "Negative" },
                    { value: 5, name: "Indeterminate" },
                    { value: 6, name: "Borderline" },
                  ]}
                  onChange={(val: any) => {
                    field.onChange(val);
                  }}
                />
              )}
            />
            <div className="mt-4 text-start">
              {errors.result && (
                <p className=" text-red-500">{String(errors.result.message)}</p>
              )}
            </div>
          </div>

          <div>
            <div className="block">
              <Label htmlFor="" value={`ชนิดสิ่งส่งตรวจ (Specimens)`} />
            </div>
            <Controller
              name="inspection_type_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...register("inspection_type_id")}
                  mainKeyId="id"
                  mainKey="name"
                  value={field.value}
                  ref={refs.inspection_type_id}
                  option={inspectionTypes}
                  disabled={state}
                  onChange={(val: any) => {
                    field.onChange(val);
                  }}
                />
              )}
            />
            <div className="mt-4 text-start">
              {errors.inspection_type_id && (
                <p className=" text-red-500">
                  {String(errors.inspection_type_id.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="name" value={`รายละเอียด`} />
            <Controller
              name="detail"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="detail"
                  {...register("detail")}
                  rows={4}
                  onFocus={() => {
                    trigger("detail");
                  }}
                  disabled={state}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("detail");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.detail && (
                <p className=" text-red-500">{String(errors.detail.message)}</p>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileRef}
            accept="image/png, image/jpeg, application/pdf, video/*"
            onChange={handleFile}
            style={{ display: "none" }}
          />
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Label htmlFor="file" value={`เลือกไฟล์`} />
              <p className="text-[12px] text-lightgray">
                (สามารถรองรับไฟล์เอกสาร รูปภาพ และวิดีโอ)
              </p>
            </div>
            {!state && (
              <button
                type="button"
                disabled={state}
                className={`rounded-[5px] bg-primary px-4 py-2 text-sm font-semibold text-white !no-underline`}
                onClick={() => fileRef.current.click()}
              >
                อัพโหลดไฟล์
              </button>
            )}
          </div>

          <div>
            {file?.map((file: any, index: any) => (
              <div
                className="mb-2 flex items-center justify-between gap-3"
                key={index}
              >
                <div className="flex gap-2">
                  <div className="rounded-[20px] bg-secondary p-2 text-sm">
                    {file.file_name ? file.file_name : file.old_file_name}
                  </div>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = file.file_path
                        ? file.file_path.replace("/public", "")
                        : file.path.replace("/public", "");
                      link.download = file.file_name || file.old_file_name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faDownload}
                      className="h-3 w-3 text-white"
                    />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={state}
                      className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary-pink"
                      onClick={() =>
                        setFile((oldFile) => {
                          return oldFile.filter(
                            (value: any, i: any) => i !== index
                          );
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
        <div
          className={`${
            currentStep !== 2 ? "hidden" : ""
          } mb-6 grid w-full grid-cols-1  gap-3 rounded-xl p-10 shadow-md shadow-gray`}
        >
          <div className="relative col-span-3 mb-9 w-full">
            {formFields?.map((item, index) => {
              // console.log("formFields"+formFields[0]); // Log item and index here
              return (
                <div className=" mb-2 grid grid-cols-3 gap-3" key={index}>
                  <div className="col-span-3 md:col-span-1">
                    <div className="block">
                      <Label
                        htmlFor={`lab_tests.${index}.pathogens_id`}
                        value={`Pathogens`}
                      />
                    </div>
                    <Controller
                      name={`lab_tests.${index}.pathogens_id`}
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          {...register(`lab_tests.${index}.pathogens_id`)}
                          mainKeyId="id"
                          mainKey="name"
                          disabled={state}
                          value={field.value}
                          option={pathogensDataType}
                          onChange={(val) => field.onChange(val)}
                          isRequired
                        />
                      )}
                    />
                    <div className="mt-4 text-start">
                      {errors?.[`lab_tests[${index}].pathogens_id`] && (
                        <p className=" text-red-500">
                          {String(
                            errors?.[`lab_tests[${index}].pathogens_id`]
                              ?.message
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-3 md:col-span-1">
                    <div className="block">
                      <Label
                        htmlFor={`lab_tests.${index}.result`}
                        value={`Result`}
                      />
                    </div>
                    <Controller
                      name={`lab_tests.${index}.result`}
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          {...register(`lab_tests.${index}.result`)}
                          value={field.value !== "" ? field.value : null}
                          disabled={state}
                          option={[
                            { value: "Detected", label: "Detected" },
                            { value: "Not Detected", label: "Not Detected" },
                            { value: "Positive", label: "Positive" },
                            { value: "Negative", label: "Negative" },
                            { value: "Indeterminate", label: "Indeterminate" },
                            { value: "Borderline", label: "Borderline" },
                          ]}
                          onChange={(val) => field.onChange(val)}
                          isRequired
                        />
                      )}
                    />
                    <div className="mt-4 text-start">
                      {errors?.[`lab_tests[${index}].result`] && (
                        <p className=" text-red-500">
                          {String(
                            errors?.[`lab_tests[${index}].result`]?.message
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-3 md:col-span-1">
                    <div className="block">
                      <Label htmlFor="remark" value={`Remark`} />
                    </div>
                    <Controller
                      name={`lab_tests.${index}.remark`}
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          disabled={state}
                          {...register(`lab_tests.${index}.remark`)}
                          id={`lab_tests.${index}.remark`}
                          type="text"
                          onChange={(val) => {
                            field.onChange(val);
                            trigger(`lab_tests.${index}.remark`);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              );
            })}

            <div className="absolute right-0 space-x-3">
              <button
                type="button"
                onClick={deleteRow}
                className="rounded-md border-2 border-red-700 bg-red-600 px-1 text-sm text-white hover:border-red-800 hover:bg-white hover:text-black"
              >
                ลบ
              </button>
              <button
                type="button"
                onClick={addNewRow}
                disabled={!isCanAdd}
                className="rounded-md border-2 border-secondary bg-secondary px-1 text-sm hover:border-primary hover:bg-white
                  hover:text-black disabled:hidden"
              >
                เพิ่ม
              </button>
            </div>
          </div>

          <div className="col-span-3 w-full">
            <Label htmlFor="name" value={`Remark / Comment`} />
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <Textarea
                  disabled={state}
                  id="comment"
                  {...register("comment")}
                  rows={4}
                  onFocus={() => {
                    trigger("comment");
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("comment");
                  }}
                />
              )}
            />
            <div className="text-start">
              {errors.comment && (
                <p className=" text-red-500">
                  {String(errors.comment.message)}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2 w-full">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-3 md:col-span-1">
                <Label htmlFor="" value={`แก้ไขครั้งที่`} />
                <Controller
                  name="count_update"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      disabled={state}
                      {...register("count_update")}
                      id="count_update"
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-span-3 md:col-span-1">
                <Label htmlFor="updated_at" value={`วันที่แก้ไข`} />
                <Controller
                  name="updated_at"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      disabled={state}
                      {...register("updated_at")}
                      onChange={field.onChange}
                      value={new Date()}
                    />
                  )}
                />
              </div>
              <div className="col-span-3 text-start md:col-span-1">
                {errors.comment && (
                  <p className=" text-red-500">
                    {String(errors.comment.message)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-3 w-full">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 md:col-span-1">
                <div className="block">
                  <Label htmlFor="report" value={`Reported By:`} />
                </div>
                <Controller
                  name="report_by_id"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      disabled={state}
                      {...register("report_by_id")}
                      mainKeyId="id"
                      mainKey="first_name"
                      value={field.value}
                      option={officerData}
                      onChange={(val: any) => {
                        field.onChange(val);
                      }}
                    />
                  )}
                />
                <div className="mt-3 text-start">
                  {errors.report_by_id && (
                    <p className=" text-red-500">
                      {String(errors.report_by_id.message)}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-3 md:col-span-1">
                <div className="block">
                  <Label htmlFor="date" value={`Date`} />
                </div>
                <Controller
                  name="report_date"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      disabled={state}
                      {...register("report_date")}
                      ref={refs.date}
                      onChange={field.onChange}
                      value={field.value ? new Date(field.value) : null}
                    />
                  )}
                />
                <div className="text-start">
                  {errors.report_date && (
                    <p className=" text-red-500">
                      {String(errors.report_date.message)}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-3 md:col-span-1">
                <div className="block">
                  <Label htmlFor="report_time" value={`Time`} />
                </div>
                <Controller
                  name="report_time"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      disabled={state}
                      placeholder="เวลา"
                      // defaultValue={dayjs("00:00", "HH:mm")}
                      value={field.value ? dayjs(field.value, "HH:mm") : null}
                      format={"HH:mm"}
                      onChange={field.onChange}
                    />
                  )}
                />
                <div className="text-start">
                  {errors.report_time && (
                    <p className=" text-red-500">
                      {String(errors.report_time.message)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3 w-full">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 md:col-span-1">
                <div className="block">
                  <Label htmlFor="approve" value={`Approved By:`} />
                </div>
                <Controller
                  name="approve_by_id"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      disabled={state}
                      {...register("approve_by_id")}
                      mainKeyId="id"
                      mainKey="first_name"
                      value={field.value}
                      option={officerData}
                      onChange={(val: any) => {
                        field.onChange(val);
                      }}
                    />
                  )}
                />
                <div className="mt-3 text-start">
                  {errors.approve_by_id && (
                    <p className=" text-red-500">
                      {String(errors.approve_by_id.message)}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-3 md:col-span-1">
                <div className="block">
                  <Label htmlFor="date" value={`Date`} />
                </div>
                <Controller
                  name="approve_date"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      disabled={state}
                      {...register("approve_date")}
                      ref={refs.date}
                      onChange={field.onChange}
                      value={field.value ? new Date(field.value) : null}
                    />
                  )}
                />
                <div className="text-start">
                  {errors.approve_date && (
                    <p className=" text-red-500">
                      {String(errors.approve_date.message)}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-3 md:col-span-1">
                <div className="block">
                  <Label htmlFor="approve_time" value={`Time`} />
                </div>
                <Controller
                  name="approve_time"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      placeholder="เวลา"
                      disabled={state}
                      // defaultValue={dayjs("00:00", "HH:mm")}
                      value={field.value ? dayjs(field.value, "HH:mm") : null}
                      format={"HH:mm"}
                      onChange={field.onChange}
                    />
                  )}
                />
                <div className="text-start">
                  {errors.approve_time && (
                    <p className=" text-red-500">
                      {String(errors.approve_time.message)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${
            currentStep !== 1 ? "hidden" : ""
          } grid w-full grid-cols-1 gap-3 md:grid-cols-2`}
        >
          <button
            type="button"
            className={`rounded-[5px] bg-secondary px-4 py-2 text-sm font-semibold !no-underline md:col-span-1`}
            onClick={() => back()}
          >
            ยกเลิก
          </button>

          <button
            type="button"
            className={`rounded-[5px] bg-primary px-4 py-2 text-sm font-semibold text-white !no-underline md:col-span-1`}
            onClick={SubmitForm}
          >
            ถัดไป
          </button>
        </div>
        <div
          className={`${
            currentStep !== 2 ? "hidden" : ""
          } grid w-full grid-cols-1 gap-3 md:grid-cols-2`}
        >
          <button
            type="button"
            className={`rounded-[5px] bg-secondary px-4 py-2 text-sm font-semibold !no-underline md:col-span-1`}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            ย้อนกลับ
          </button>
          {!state && (
            <button
              type="submit"
              disabled={state}
              className={`rounded-[5px] bg-primary px-4 py-2 text-sm font-semibold text-white !no-underline md:col-span-1`}
            >
              บันทึก
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

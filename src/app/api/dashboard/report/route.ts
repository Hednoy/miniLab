import ApiError from "@/lib-server/error";
import { getLabListForReport } from "@/lib-server/services/dashboard";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { LabForReport, LabsGetData } from "@/types/models/Lab";
import { LabTestsGetData } from "@/types/models/LabTest";
import { NextRequest } from "next/server";
import { z } from "zod";

const dashboardSchema = z.object({
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  searchTerm: z.string().optional().or(z.literal("")),
  sort: z.string().optional().or(z.literal("")),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal("asc"))
    .or(z.literal("desc")),
  test_type_id: z.preprocess(stringToNumber, z.number().optional()),
  result: z.string().optional().or(z.literal("")),
});

const validateDashboardQueryParams = (params: QueryParamsType): LabsGetData => {
  const result = dashboardSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as LabTestsGetData;
};

// Function to convert array to CSV format
function convertArrayToCSV(array: LabForReport[]) {
  // const header =
  //   [
  //     "\uFEFF" + "หมายเลข case",
  //     "โรงพยาบาล",
  //     "เลขประจำตัวประชาชน",
  //     "รายการ",
  //     "หลักการ",
  //     "ผลการทดสอบ",
  //   ].join(",") + "\n";
  const header =
    [
      "คำนำหน้า",
      "ชื่อ-สกุล",
      "เพศ",
      "วัน/เดือน/ปีเกิด",
      "อายุ(ปี)",
      "HN(ไม่บังคับใส่)",
      "เบอร์โทรศัพท์",
      "เลขบัตรประชาชน/Passport number(ไม่บังคับ)",
      "หน่วยงาน",
      "รายการตรวจวิเคราะห์",
      "วันที่เก็บตัวอย่าง Collected Date/time",
      "วันที่รับตัวอย่าง Received Date/time",
      "Lab No.",
      "Specimen",
      "Result",
      "คำอธิบายผลเพิ่มเติม เช่น ค่า Ct หรือ ค่าตัวเลขที่ได้จากการทดสอบ",
      "Comment/Note",
      "Method",
      "Reporter",
      "Date of Report",
      "Approver",
      "Date of Approve",
    ].join(",") + "\n";

  const rows = array?.map((obj) =>
    Object.values(obj)
      .map((value) => {
        if (typeof value === "string") {
          // Escape double quotes
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(",")
  );

  return header + rows.join("\n");
}

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateDashboardQueryParams(params);
    // console.log('parsedData',parsedData)
    // console.log('params',params)
    const data = await getLabListForReport(parsedData);
    if (data.length === 0) {
      data.push({
        title: "",
        full_name: "",
        id_cad: "",
        gender: "",
        date_of_birth: "",
        age: "",
        hn_no: "",
        tel_no: "",
        id_card: "",
        hospital_name: "",
        test_name: "",
        collected_date: "",
        received_date: "",
        lab_no: "",
        specimen: "",
        result: "",
        description: "",
        comment: "",
        method: "",
        reporter: "",
        date_of_report: "",
        approver: "",
        date_of_approve: "",
      });
    }

    // Convert array to CSV format
    const csv = convertArrayToCSV(data);

    return new Response(csv, {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": "attachment; filename=Database LAB IUDC.csv",
      },
    });
    // return Response.json({ message: "Hello" });
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET };

import { number } from "zod";
import prisma from "@/lib-server/prisma";
import { LabTest, Prisma } from "@prisma/client";
import ApiError from "../error";
import {
  LabTestChart,
  LabTestCreateFormData,
  LabTestForReport,
  LabTestsGetData,
} from "@/types/models/LabTest";
import {
  convertDateToString,
  convertToThaiFormat,
  filterSearchTerm,
} from "@/utils";
import { PaginatedResponse, SortDirection } from "@/types";
import { tr } from "@faker-js/faker";
import { LabChart, LabForReport } from "@/types/models/Lab";
import fs from "fs";
import path from "path";
import { format } from "date-fns";

export const getLabTest = async (id: number): Promise<LabTest> => {
  const labTest = await prisma.labTest.findUnique({ where: { id } });
  if (!labTest) throw new ApiError(`LabTest with id: ${id} not found.`, 404);

  return labTest;
};

export const getLabTestListForReport = async (
  labtestGetdata: LabTestsGetData = {}
): Promise<LabTestForReport[]> => {
  const { searchTerm, sortDirection } = labtestGetdata;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.LabTestWhereInput = {};

  if (search) {
    where.remark = { contains: search };
    where.result = { contains: search };
  }

  if (labtestGetdata?.result) {
    where.result = labtestGetdata?.result;
  }

  let labtests = await prisma.labTest.findMany({
    where,
    select: {
      Lab: {
        select: {
          Hospital: true,
          Patient: true,
          case_no: true,
        },
      },
    },
    orderBy: {
      updated_at: sortDirection as SortDirection,
    },
  });

  labtests = Array.isArray(labtests) ? labtests : [];

  const labtestsForReport: LabTestForReport[] = [];
  labtests.forEach((labtest) => {
    labtestsForReport.push({
      hn_no: labtest.Lab?.Patient?.hn || "",
      an_no: labtest.Lab?.Patient?.an || "",
      case_no: labtest?.Lab?.case_no || "",
      hospital_name: labtest.Lab?.Hospital?.name || "",
      id_cad: labtest.Lab?.Patient?.id_card || "",
    });
  });

  return labtestsForReport;
};

export const getLabTestList = async (
  labtestGetdata: LabTestsGetData = {}
): Promise<PaginatedResponse<LabTestForReport>> => {
  const { page = 1, limit = 999, searchTerm, sortDirection } = labtestGetdata;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.LabTestWhereInput = {};
  if (search) {
    where.remark = { contains: search };
    where.result = { contains: search };
  }

  if (labtestGetdata?.dateStart) {
    where.created_at = {
      gte: new Date(labtestGetdata.dateStart),
    };
  }

  if (labtestGetdata?.dateEnd) {
    where.created_at = {
      lte: new Date(labtestGetdata.dateEnd),
    };
  }

  if (labtestGetdata?.result) {
    where.result = labtestGetdata?.result;
  }

  const totalCount = await prisma.labTest.count({ where });

  // console.log(labtestGetdata?.test_type_id, "labtestGetdata");

  const labtests = await prisma.labTest.findMany({
    // where,
    where: {
      ...where,
      Lab: {
        test_type_id: labtestGetdata?.test_type_id,
      },
    },
    select: {
      Lab: {
        select: {
          Hospital: true,
          Patient: true,
          case_no: true,
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      updated_at: sortDirection as SortDirection,
    },
  });

  //   labtests = Array.isArray(labtests) ? labtests : [];

  const respLabTests: LabTestForReport[] = [];
  labtests.forEach((labtest) => {
    respLabTests.push({
      hn_no: labtest.Lab?.Patient?.hn || "",
      an_no: labtest.Lab?.Patient?.an || "",
      case_no: labtest?.Lab?.case_no || "",
      hospital_name: labtest.Lab?.Hospital?.name || "",
      id_cad: labtest.Lab?.Patient?.id_card || "",
    });
  });

  const result = {
    items: respLabTests,
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + labtests.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const getLabTestChartData = async (
  month: number
): Promise<LabTestChart> => {
  const labTestDetected = await prisma.labTest.count({
    where: {
      result: "detected",
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });

  const labTestNotDetected = await prisma.labTest.count({
    where: {
      result: "not_detected",
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });

  const labTestAll = await prisma.labTest.count({
    where: {
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });

  const result: LabTestChart = {
    detected: labTestDetected,
    detected_percentage: labTestAll ? (labTestDetected / labTestAll) * 100 : 0,
    not_detected: labTestNotDetected,
    not_detected_percentage: labTestAll
      ? (labTestNotDetected / labTestAll) * 100
      : 0,
    total: labTestAll,
  };

  return result;
};

export const createLabTest = async (
  data: LabTestCreateFormData
): Promise<LabTest> => {
  const labTest = await prisma.labTest.create({
    data,
  });

  return labTest;
};

// Lab Report
export const getLabListForReport = async (
  labGetdata: LabsGetData = {}
): Promise<any[]> => {
  const { searchTerm, sortDirection, sort = "updated_at" } = labGetdata;

  const search = filterSearchTerm(searchTerm);

  let where: Prisma.LabWhereInput = {};

  const dateStart = labGetdata.dateStart;

  const dateEnd = labGetdata.dateEnd;

  if (search) {
    where = {
      OR: [
        {
          detail: { contains: search },
        },
        {
          case_no: { contains: search },
        },
        {
          detection_method: { contains: search },
        },
      ],
    };
  }

  if (labGetdata?.test_type_id) {
    where.test_type_id = labGetdata.test_type_id;
  }

  if (dateStart && dateEnd) {
    // console.log(`Filtering from ${dateStart} to ${dateEnd}`);
    where.created_at = {
      gte: new Date(dateStart),
      lte: new Date(dateEnd),
    };
  } else if (dateStart) {
    // console.log(`Filtering from ${dateStart}`);
    where.created_at = {
      gte: new Date(dateStart),
    };
  } else if (dateEnd) {
    // console.log(`Filtering up to ${dateEnd}`);
    where.created_at = {
      lte: new Date(dateEnd),
    };
  }
  // console.log("where", where);
  let labs = await prisma.lab.findMany({
    where,
    include: {
      TestType: true,
      Hospital: true,
      Patient: true,
      Machine: true,
      InspectionType: true,
    },
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  labs = Array.isArray(labs) ? labs : [];

  // "หมายเลข case",
  // "หน่วยงาน",
  // "เลขประจำตัวประชาชน",
  // "รายการ",
  // "หลักการ",
  // "ผลการทดสอบ",

  const labForReport: LabForReport[] = [];
  await Promise.all(
    labs.map(async (lab) => {
      const reportBy = await prisma.officer.findFirst({
        where: { member_id: lab?.report_by_id || 0 },
      });
      const approveBy = await prisma.officer.findFirst({
        where: { member_id: lab?.approve_by_id || 0 },
      });

      const reportByName = reportBy
        ? `${reportBy.title_name || ""} ${reportBy.first_name || ""} ${reportBy.last_name || ""}`
        : "";
      const approveByName = approveBy
        ? `${approveBy.title_name || ""} ${approveBy.first_name || ""} ${approveBy.last_name || ""}`
        : "";
      labForReport.push({
        title: lab?.Patient?.title || "",
        full_name:
          (lab.Patient?.first_name ?? "") + " " + lab.Patient?.last_name || "",
        gender: lab?.Patient?.gender || "",
        date_of_birth: convertDateToString(lab?.Patient?.date_of_birth || null),
        age: lab?.Patient?.age?.toString() || "",
        hn_no: lab?.Patient?.hn || "",
        tel_no: lab?.Patient?.phone_no || "",
        id_card: lab?.Patient?.id_card || "",
        hospital_name: lab?.Hospital?.name || "",
        test_name: lab?.TestType?.prefix_name || "",
        collected_date:
          lab?.Patient?.collected_date?.toString() === "1900-01-01" ||
          lab?.Patient?.collected_date?.toString() === "0001-01-01"
            ? ""
            : convertToThaiFormat(
                format(
                  new Date(lab?.Patient?.collected_date ?? ""),
                  "dd/MM/yyyy"
                )
              ),
        received_date:
          lab?.Patient?.received_date?.toString() === "1900-01-01 00:00:00.000"
            ? ""
            : convertToThaiFormat(
                format(
                  new Date(lab?.Patient?.received_date ?? ""),
                  "dd/MM/yyyy"
                )
              ) +
              " " +
              (lab?.Patient?.received_time === "00:00:00" ||
              lab?.Patient?.received_time === "00:00:00.000"
                ? ""
                : lab?.Patient?.received_time?.toString().split(".")[0]),
        lab_no: lab?.case_no || "",
        specimen: lab?.InspectionType?.code || "",
        result:
          lab?.result === 1
            ? "Detected"
            : lab?.result === 2
              ? "Not Detected"
              : lab?.result === 3
                ? "Positive"
                : lab?.result === 4
                  ? "Negative"
                  : lab?.result === 5
                    ? "Indeterminate"
                    : lab?.result === 6
                      ? "Borderline"
                      : "",
        description: lab?.detail || "",
        comment: lab?.comment || "",
        method: lab?.TestType?.subfix_name || "",
        reporter: reportByName,
        date_of_report:
          lab?.report_date?.toString() === "1900-01-01" ||
          lab?.report_date?.toString() === "0001-01-01"
            ? ""
            : convertToThaiFormat(
                format(new Date(lab?.report_date ?? ""), "dd/MM/yyyy")
              ),
        approver: approveByName,
        date_of_approve:
          lab?.approve_date?.toString() === "1900-01-01" ||
          lab?.approve_date?.toString() === "0001-01-01"
            ? ""
            : convertToThaiFormat(
                format(new Date(lab?.approve_date ?? ""), "dd/MM/yyyy")
              ),
        updated_at: lab?.updated_at || null,
        count_update: lab?.count_update || 0,
      });
    })
  );

  return labForReport;
};

type LabsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  dateStart: string;
  dateEnd: string;
  sort: string;
  sortDirection: SortDirection;
  test_type_id: number;
  inspection_type_id: number;
  result: number;
}>;

export const getLabList = async (
  labGetData: LabsGetData = {}
): Promise<PaginatedResponse<LabTestForReport>> => {
  const {
    page = 1,
    limit = 999,
    searchTerm,
    sort = "updated_at",
    sortDirection,
    dateStart,
    dateEnd,
    test_type_id,
    result: resultlab,
  } = labGetData;

  // Log the received parameters
  // console.log("Received labGetData:", labGetData);

  const search = filterSearchTerm(searchTerm);

  const translateGender = (term: string) => {
    const lowerTerm = term.toLowerCase();
    if (lowerTerm.startsWith("ชาย")) return "Male";
    if (lowerTerm.startsWith("หญิง")) return "Female";
    if (
      lowerTerm.startsWith("ไม่") ||
      lowerTerm.startsWith("ไม่ระ") ||
      lowerTerm.startsWith("ไม่ระบุ")
    )
      return "Unkhow";
    return term;
  };
  const nameParts = search ? search.split(" ") : [];
  const patientConditions = [];

  if (nameParts.length === 1) {
    patientConditions.push(
      { first_name: { contains: nameParts[0] } },
      { last_name: { contains: nameParts[0] } }
    );
  } else if (nameParts.length > 1 && nameParts.length < 3) {
    patientConditions.push({
      AND: [
        // { title : { contains: nameParts[0] } },
        { first_name: { contains: nameParts[0] } },
        { last_name: { contains: nameParts[1] } },
      ],
    });
  } else {
    patientConditions.push(
      { title: { contains: nameParts[0] } },
      { first_name: { contains: nameParts[1] } },
      { last_name: { contains: nameParts[2] } }
    );
  }

  let where: Prisma.LabWhereInput = {};

  if (search) {
    where = {
      OR: [
        {
          detail: { contains: search },
        },
        {
          case_no: { contains: search },
        },
        {
          detection_method: { contains: search },
        },
        {
          Patient: {
            OR: patientConditions,
          },
        },
        {
          TestType: { subfix_name: { contains: searchTerm } },
        },
      ],
      ...(test_type_id && { test_type_id }),
    };
  }

  if (labGetData?.test_type_id) {
    where.test_type_id = labGetData.test_type_id;
  }

  // Log date filtering information
  if (dateStart && dateEnd) {
    // console.log(`Filtering from ${dateStart} to ${dateEnd}`);
    where.created_at = {
      gte: new Date(dateStart),
      lte: new Date(dateEnd),
    };
  } else if (dateStart) {
    // console.log(`Filtering from ${dateStart}`);
    where.created_at = {
      gte: new Date(dateStart),
    };
  } else if (dateEnd) {
    // console.log(`Filtering up to ${dateEnd}`);
    where.created_at = {
      lte: new Date(dateEnd),
    };
  }

  if (resultlab) {
    where.result = Number(resultlab);
  }

  const totalCount = await prisma.lab.count({ where });

  let labs = await prisma.lab.findMany({
    where,
    include: {
      TestType: true,
      Hospital: true,
      Patient: {
        include: {
          hospital: true,
        },
      },
      Machine: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sort]: sortDirection as Prisma.SortOrder,
    },
  });

  labs = Array.isArray(labs) ? labs : [];

  const labForReport: LabTestForReport[] = [];
  labs.forEach((lab) => {
    labForReport.push({
      id: lab?.id || 0,
      hn_no: lab?.Patient?.hn || "",
      an_no: lab?.Patient?.an || "",
      case_no: lab?.case_no || "",
      hospital_name: lab?.Patient?.hospital?.name || "",
      fullname:
        (lab.Patient?.title ?? "") +
        " " +
        (lab.Patient?.first_name ?? "") +
        " " +
        (lab.Patient?.last_name ?? ""),
      id_cad: lab?.Patient?.id_card || "",
      age: lab?.Patient?.age || 0,
      gender: lab?.Patient?.gender || "",
      prefix_name: lab?.TestType?.prefix_name || "",
      subfix_name: lab?.TestType?.subfix_name || "",
      result:
        lab?.result === 1
          ? "Detected"
          : lab?.result === 2
            ? "Not Detected"
            : lab?.result === 3
              ? "Positive"
              : lab?.result === 4
                ? "Negative"
                : lab?.result === 5
                  ? "Indeterminate"
                  : lab?.result === 6
                    ? "Borderline"
                    : "",
      created_at: lab?.created_at || null,
    });
  });

  const result = {
    items: labForReport,
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + labs.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const getLabChartData = async (month: number): Promise<LabChart> => {
  const labDetected = await prisma.labTest.count({
    where: {
      result: "Detected",
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });

  const labNotDetected = await prisma.labTest.count({
    where: {
      result: "Not detected",
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });
  const labPositive = await prisma.labTest.count({
    where: {
      result: "Positive",
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });
  const labNegative = await prisma.labTest.count({
    where: {
      result: "Negative",
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });
  const labIndeterminate = await prisma.labTest.count({
    where: {
      result: "Indeterminate",
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });
  const labBorderline = await prisma.labTest.count({
    where: {
      result: "Borderline",
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });

  const labTestAll = await prisma.lab.count({
    where: {
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });

  const result: LabChart = {
    detected: labDetected,

    detected_percentage: labTestAll
      ? Number(((labDetected / labTestAll) * 100).toFixed(2))
      : 0,
    not_detected: labNotDetected,
    not_detected_percentage: labTestAll
      ? Number(((labNotDetected / labTestAll) * 100).toFixed(2))
      : 0,
    positive: labPositive,

    positive_percentage: labTestAll
      ? Number(((labPositive / labTestAll) * 100).toFixed(2))
      : 0,
    negative: labNegative,
    negative_percentage: labTestAll
      ? Number(((labNegative / labTestAll) * 100).toFixed(2))
      : 0,
    indeterminate: labIndeterminate,
    indeterminate_percentage: labTestAll
      ? Number(((labIndeterminate / labTestAll) * 100).toFixed(2))
      : 0,
    borderline: labBorderline,
    borderline_percentage: labTestAll
      ? Number(((labBorderline / labTestAll) * 100).toFixed(2))
      : 0,
    total: labTestAll,
  };
  return result;
};

export const getLabChartPathogensData = async (
  startDate: Date,
  endDate: Date,
  pathogensId?: number,
  test_type_id?: number
): Promise<any> => {
  // get pathogens data
  const labTestResult: {
    id: number;
    name: string;
    count: number;
  }[] = [];

  const pathogens2 = await prisma.pathogens.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const labTest = await prisma.pathogens.findMany({
    select: {
      id: true,
      name: true,
      PathogensTestType: {
        select: {
          id: true,
          name: true,
          pathogens_id: true,
          test_type_id: true,
        },
      },
    },
  });

  if (pathogensId || (!pathogensId && !test_type_id)) {
    // labTestResult.push({
    //   id: 0,
    //   name: "อื่นๆ",
    //   count: 0,
    // });
    const filterPathogen = pathogensId
      ? pathogens2.filter((e) => e.id == pathogensId)
      : pathogens2;

    for (const pathogen of filterPathogen) {
      const countLabtest = await prisma.labTest.count({
        where: {
          pathogens_id: pathogen.id,
          created_at: {
            gte: startDate,
            lt: endDate,
          },
          result: {
            in: ["Detected", "Positive", "Indeterminate", "Borderline"],
          },
        },
      });

      // if (labTestResult.length < 10) {
      if (countLabtest > 0) {
        labTestResult.push({
          id: pathogen.id,
          name: pathogen.name,
          count: countLabtest,
        });
      }
      // } else {
      //   labTestResult[0].count += countLabtest;
      // }
    }
  }
  if (test_type_id) {
    const filterPathogen = test_type_id
      ? labTest.filter((e) =>
          e.PathogensTestType.some((pt) => pt.test_type_id == test_type_id)
        )
      : labTest;
    for (const pathogen of filterPathogen) {
      const countLabtest = await prisma.labTest.count({
        where: {
          pathogens_id: pathogen.id,
          created_at: {
            gte: startDate,
            lt: endDate,
          },
          result: {
            in: ["Detected", "Positive", "Indeterminate", "Borderline"],
          },
        },
      });
      if (countLabtest > 0) {
        labTestResult.push({
          id: pathogen.id,
          name: pathogen.name,
          count: countLabtest,
        });
      }
    }
  }

  const countLabtest = await prisma.labTest.count({
    where: {
      created_at: {
        gte: startDate,
        lt: endDate,
      },
      result: {
        in: ["Detected", "Positive", "Indeterminate", "Borderline"],
      },
    },
  });

  // array to object
  const res = labTestResult.reduce(
    (acc, cur) => {
      acc[cur.id] = cur.count;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const result = {
    total: countLabtest,
    ...res,
  };

  return result;
};

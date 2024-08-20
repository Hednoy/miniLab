import prisma from "@/lib-server/prisma";
import { LabTest, Prisma } from "@prisma/client";
import ApiError from "../error";
import {
  LabTestChart,
  LabTestCreateFormData,
  LabTestForReport,
  LabTestsGetData,
} from "@/types/models/LabTest";
import { convertDateToString, filterSearchTerm } from "@/utils";
import { PaginatedResponse, SortDirection } from "@/types";
import { tr } from "@faker-js/faker";
import { LabChart, LabForReport } from "@/types/models/Lab";

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
    console.log(`Filtering from ${dateStart} to ${dateEnd}`);
    where.created_at = {
      gte: new Date(dateStart),
      lte: new Date(dateEnd),
    };
  } else if (dateStart) {
    console.log(`Filtering from ${dateStart}`);
    where.created_at = {
      gte: new Date(dateStart),
    };
  } else if (dateEnd) {
    console.log(`Filtering up to ${dateEnd}`);
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
  labs.forEach((lab) => {
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
      collected_date: convertDateToString(lab?.created_at || null),
      received_date: convertDateToString(lab?.report_date || null),
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
      method: lab?.detection_method || "",
      reporter: "",
      date_of_report: convertDateToString(lab?.report_date || null),
      approver: "",
      date_of_approve: convertDateToString(lab?.approve_date || null),
    });
  });

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
  } = labGetData;

  // Log the received parameters
  // console.log("Received labGetData:", labGetData);

  const search = filterSearchTerm(searchTerm);

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
      ],
    };
  }

  if (labGetData?.test_type_id) {
    where.test_type_id = labGetData.test_type_id;
  }

  // Log date filtering information
  if (dateStart && dateEnd) {
    console.log(`Filtering from ${dateStart} to ${dateEnd}`);
    where.created_at = {
      gte: new Date(dateStart),
      lte: new Date(dateEnd),
    };
  } else if (dateStart) {
    console.log(`Filtering from ${dateStart}`);
    where.created_at = {
      gte: new Date(dateStart),
    };
  } else if (dateEnd) {
    console.log(`Filtering up to ${dateEnd}`);
    where.created_at = {
      lte: new Date(dateEnd),
    };
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
  const labDetected = await prisma.lab.count({
    where: {
      result: 1,
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });

  const labNotDetected = await prisma.lab.count({
    where: {
      result: 2,
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });
  const labPositive = await prisma.lab.count({
    where: {
      result: 3,
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });
  const labNegative = await prisma.lab.count({
    where: {
      result: 4,
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });
  const labIndeterminate = await prisma.lab.count({
    where: {
      result: 5,
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });
  const labBorderline = await prisma.lab.count({
    where: {
      result: 6,
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
  month: number,
  pathogensId?: number
): Promise<any> => {
  // get pathogens data
  const labTestResult: {
    id: number;
    name: string;
    count: number;
  }[] = [];

  // const pathogens = await prisma.pathogens
  //   .findMany({
  //     select: {
  //       id: true,
  //       name: true,
  //     },
  //     take: 9,
  //   })
  //   .then((res) => {
  //     res.map(async (pathogen) => {
  //       const countLabtest = await prisma.labTest.count({
  //         where: {
  //           pathogens_id: pathogen.id,
  //           created_at: {
  //             gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
  //             lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
  //           },
  //         },
  //       });

  //       if (countLabtest > 0)
  //         labTestResult.push({
  //           id: pathogen.id,
  //           name: pathogen.name,
  //           count: countLabtest,
  //         });
  //     });
  //   });

  const pathogens2 = await prisma.pathogens.findMany({
    select: {
      id: true,
      name: true,
    },
    // take: 9,
  });

  if (pathogens2) {
    await labTestResult.push({
      id: 0,
      name: "อื่นๆ",
      count: 0,
    });
    const filterPathogen = pathogensId
      ? pathogens2.filter((e) => e.id == pathogensId)
      : pathogens2;

    filterPathogen.forEach(async (pathogen, i) => {
      const countLabtest = await prisma.labTest.count({
        where: {
          pathogens_id: pathogen.id,
          created_at: {
            gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
            lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
          },
        },
      });

      if (i < 9) {
        if (countLabtest > 0) {
          await labTestResult.push({
            id: pathogen.id,
            name: pathogen.name,
            count: countLabtest,
          });
        }
      } else {
        labTestResult[0].count += countLabtest;
      }
    });
  }

  const countLabtest = await prisma.labTest.count({
    where: {
      created_at: {
        gte: new Date(new Date().getFullYear(), month - 1, 1), // January 1st of the current year
        lt: new Date(new Date().getFullYear(), month, 1), // February 1st of the current year
      },
    },
  });

  // array to object
  const res = await labTestResult.reduce(
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

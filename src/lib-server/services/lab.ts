import prisma from "@/lib-server/prisma";
import { Lab, Prisma, TestType } from "@prisma/client";
import ApiError from "../error";
import {
  LabAttachments,
  LabCreateFormData,
  LabGetByID,
  LabTestCreateData,
  LabUpdateData,
  LabsGetData,
} from "@/types/models/Lab";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";

export const getLab = async (id: number): Promise<LabGetByID> => {
  const lab = await prisma.lab.findUnique({
    where: { id },
    include: {
      TestType: true,
      Hospital: true,
      Patient: true,
      Machine: true,
      InspectionType: true,
    },
  });
  if (!lab) throw new ApiError(`Lab with id: ${id} not found.`, 404);

  const labtestlist = await prisma.labTest.findMany({
    where: {
      lab_id: lab.id,
    },
  });

  const labtestListres: LabTestCreateData[] = [];
  if (labtestlist) {
    labtestlist?.forEach((lbtest) => {
      labtestListres.push({
        result: lbtest.result,
        remark: lbtest.remark,
        pathogens_id: lbtest.pathogens_id,
      });
    });
  }

  const labattachments = await prisma.attachment.findMany({
    where: {
      lab_id: lab.id,
    },
  });
  const labAttres: LabAttachments[] = [];
  if (labattachments) {
    labattachments?.forEach((lbattach) => {
      labAttres.push({
        name: lbattach.name,
        file_name: lbattach.file_name,
        file_path: lbattach.file_path,
        file_type: lbattach.file_type,
        file_size: lbattach.file_size,
        inspection_type_id: lbattach.inspection_type_id || 0,
        description: lbattach.description || "",
      });
    });
  }

  const resp: LabGetByID = {
    id: lab.id,
    test_type_id: lab.test_type_id || 0,
    inspection_type_id: lab.inspection_type_id,
    approve_by_id: lab.approve_by_id || 0,
    approve_date: lab.approve_date,
    case_no: lab.case_no,
    machine_id: lab.machine_id,
    hospital_id: lab.hospital_id || 0,
    patient_id: lab.patient_id || 0,
    detail: lab.detail || "",
    paper_code: lab.paper_code || "",
    comment: lab.comment || "",
    detection_method: lab.detection_method || "",
    status: lab.status || "",
    result: lab.result,
    report_by_id: lab.report_by_id || 0,
    report_date: lab.report_date,
    report_time: lab.report_time || "",
    approve_time: lab.approve_time || "",

    lab_attachments: labAttres,
    lab_tests: labtestListres,

    test_type: lab.TestType,
    hospital: lab.Hospital,
    patient: lab.Patient,
    machine: lab.Machine,
    inspection_type: lab.InspectionType,
    updated_at: lab.updated_at,
  };

  return resp;
};

export const getLabList = async (
  labGetData: LabsGetData = {}
): Promise<PaginatedResponse<Lab>> => {
  const {
    page = 1,
    limit = 999,
    sort = "updated_at",
    searchTerm = "",
    sortDirection = "desc",
  } = labGetData;

  let dateSearch: Date | undefined;
  if (searchTerm) {
    const parsedDate = new Date(searchTerm);
    if (!isNaN(parsedDate.getTime())) {
      dateSearch = parsedDate;
    }
  }
  const translateGender = (term: string) => {
    const lowerTerm = term.toLowerCase();
    if (lowerTerm.startsWith("ช")) return "Male";
    if (lowerTerm.startsWith("ห") || lowerTerm.startsWith("ญ")) return "Female";
    return term;
  };
  const nameParts = searchTerm ? searchTerm.split(" ") : [];
  const patientConditions = [];

  if (nameParts.length === 1) {
    patientConditions.push(
      { OR: [{ title: { contains: nameParts[0] } }, { title: null }] },
      { first_name: { contains: nameParts[1] || nameParts[0] } },
      { last_name: { contains: nameParts[0] || nameParts[1] } }
    );
  } else if (nameParts.length > 1) {
    patientConditions.push({
      AND: [
        { OR: [{ title: { contains: nameParts[0] } }, { title: null }] },
        { first_name: { contains: nameParts[1] || nameParts[0] } },
        { last_name: { contains: nameParts[2] || nameParts[1] } },
      ],
    });
  }

  const where: Prisma.LabWhereInput = {
    OR: [
      {
        case_no: {
          contains: searchTerm,
        },
      },
      {
        detection_method: {
          contains: searchTerm,
        },
      },
      {
        Patient: {
          OR: patientConditions,
        },
      },
      {
        InspectionType: {
          OR: [{ name: { contains: searchTerm } }],
        },
      },
      {
        Machine: {
          OR: [{ name: { contains: searchTerm } }],
        },
      },
      {
        TestType: {
          OR: [
            { prefix_name: { contains: searchTerm } },
            { subfix_name: { contains: searchTerm } },
          ],
        },
      },
      ...(dateSearch
        ? [
            {
              created_at: {
                gte: dateSearch,
              },
            },
            {
              updated_at: {
                gte: dateSearch,
              },
            },
          ]
        : []),
    ],
  };
  if (labGetData?.test_type_id) {
    where.test_type_id = labGetData.test_type_id;
  }

  const totalCount = await prisma.lab.count({ where });

  let labs = await prisma.lab.findMany({
    where,
    include: {
      TestType: true,
      Hospital: true,
      Patient: true,
      Machine: true,
      InspectionType: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  labs = Array.isArray(labs) ? labs : [];

  const result = {
    items: labs,
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

export const createLab = async (data: LabCreateFormData): Promise<Lab> => {
  const lab = await prisma.lab.create({
    data: {
      test_type_id: data.test_type_id,
      inspection_type_id: data.inspection_type_id,
      case_no: data.case_no,
      machine_id: data.machine_id || 0,
      hospital_id: data.hospital_id,
      patient_id: data.patient_id,
      detail: data.detail,
      paper_code: data.paper_code,
      comment: data.comment,
      detection_method: data.detection_method,
      status: data.status,
      approve_by_id: data.approve_by_id,
      approve_date: data.approve_date,
      report_by_id: data.report_by_id,
      report_date: data.report_date,
      report_time: data.report_time,
      result: data.result,
    },
  });

  if (!lab) throw new ApiError(`Lab create error`, 500);

  if (data?.lab_tests) {
    await prisma.labTest.createMany({
      data: data.lab_tests.map((labTest) => ({
        result: labTest.result,
        remark: labTest.remark,
        pathogens_id: labTest.pathogens_id,
        lab_id: lab.id,
      })),
    });
  }

  if (data?.lab_attachments) {
    data?.lab_attachments.forEach(async (labAttachment) => {
      const labat = await prisma.attachment.create({
        data: {
          name: labAttachment.name,
          description: labAttachment.description,
          file_name: labAttachment.file_name,
          file_path: labAttachment.file_path,
          file_type: labAttachment.file_type,
          file_size: labAttachment.file_size,
          inspection_type_id: labAttachment.inspection_type_id,
          lab_id: lab.id,
        },
      });
      if (!labat) throw new ApiError(`Lab attachment create error`, 500);

      const labatCreate = await prisma.attachmentLab.create({
        data: {
          lab_id: lab.id,
          attachment_id: labat.id,
        },
      });

      if (!labatCreate) throw new ApiError(`Lab attachment create error`, 500);
    });
  }

  return lab;
};

export const updateLab = async (
  data: LabCreateFormData,
  id: number
): Promise<Lab> => {
  const lab = await prisma.lab.update({
    where: { id },
    data: {
      inspection_type_id: data.inspection_type_id,
      case_no: data.case_no,
      machine_id: data.machine_id ?? 0,
      hospital_id: data.hospital_id,
      patient_id: data.patient_id,
      detail: data.detail,
      paper_code: data.paper_code,
      comment: data.comment,
      detection_method: data.detection_method,
      status: data.status,
      approve_by_id: data.approve_by_id,
      approve_date: data.approve_date,
      report_by_id: data.report_by_id,
      report_date: data.report_date,
      report_time: data.report_time,
      result: data.result,
    },
  });

  if (!lab) throw new ApiError(`Lab update error`, 500);

  if (data?.lab_tests) {
    await prisma.labTest.deleteMany({
      where: {
        lab_id: id,
      },
    });

    await prisma.labTest.createMany({
      data: data.lab_tests.map((labTest) => ({
        result: labTest.result,
        remark: labTest.remark,
        pathogens_id: labTest.pathogens_id,
        lab_id: id,
      })),
    });
  }

  if (data?.lab_attachments) {
    await prisma.attachmentLab.deleteMany({
      where: {
        lab_id: id,
      },
    });

    await prisma.attachment.deleteMany({
      where: {
        lab_id: id,
      },
    });

    data?.lab_attachments.forEach(async (labAttachment) => {
      const labat = await prisma.attachment.create({
        data: {
          name: labAttachment.name,
          description: labAttachment.description,
          file_name: labAttachment.file_name,
          file_path: labAttachment.file_path,
          file_type: labAttachment.file_type,
          file_size: labAttachment.file_size,
          inspection_type_id: labAttachment.inspection_type_id,
          lab_id: id,
        },
      });
      if (!labat) throw new ApiError(`Lab attachment create error`, 500);

      const labatCreate = await prisma.attachmentLab.create({
        data: {
          lab_id: id,
          attachment_id: labat.id,
        },
      });

      if (!labatCreate) throw new ApiError(`Lab attachment create error`, 500);
    });
  }

  return lab;
};

export const deleteLab = async (id: number): Promise<Lab> => {
  await prisma.attachmentLab.deleteMany({
    where: {
      lab_id: id,
    },
  });

  await prisma.labTest.deleteMany({
    where: {
      lab_id: id,
    },
  });

  const lab = await prisma.lab.delete({ where: { id } });

  return lab;
};

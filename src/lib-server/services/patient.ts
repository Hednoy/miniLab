import prisma from "@/lib-server/prisma";
import { Patient, Prisma } from "@prisma/client";
import ApiError from "../error";
import {
  PatientCreateFormData,
  PatientUpdateData,
  PatientsGetData,
} from "@/types/models/Patient";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";

export const getPatient = async (id: number): Promise<Patient> => {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      hospital: true,
      Lab: true,
    },
  });
  if (!patient) throw new ApiError(`Patient with id: ${id} not found.`, 404);

  return patient;
};

export const getPatientList = async (
  patientGetData: PatientsGetData = {}
): Promise<PaginatedResponse<Patient>> => {
  const {
    page = 1,
    limit = 999,
    sort = "updated_at",
    searchTerm = "",
    sortDirection = "desc",
  } = patientGetData;

  let dateSearch: Date | undefined;
  if (searchTerm) {
    const parsedDate = new Date(searchTerm);
    if (!isNaN(parsedDate.getTime())) {
      dateSearch = parsedDate;
    }
  }

  const translateGender = (term: string) => {
    const lowerTerm = term.toLowerCase();
    if (lowerTerm.startsWith("ชาย")) return "Male";
    if (lowerTerm.startsWith("หญิง")) return "Female";
    return term;
  };
  const translatedSearchTerm = translateGender(searchTerm);

  const nameParts = searchTerm ? searchTerm.split(" ") : [];
  const patientConditions = [];
  console.log(nameParts.length);
  if (nameParts.length === 1) {
    patientConditions.push(
      { first_name: { contains: nameParts[0] } },
      { last_name: { contains: nameParts[0] } }
    );
  } else if (nameParts.length === 2) {
    patientConditions.push(
      { first_name: { contains: nameParts[0] } },
      { last_name: { contains: nameParts[1] } }
    );
  } else if (nameParts.length === 3) {
    patientConditions.push(
      { title: { contains: nameParts[0] } },
      { first_name: { contains: nameParts[1] } },
      { last_name: { contains: nameParts[2] } }
    );
  } else if (nameParts.length > 3) {
    patientConditions.push(
      { title: { contains: nameParts[0] } },
      { first_name: { contains: nameParts.slice(1, -1).join(" ") } },
      { last_name: { contains: nameParts[nameParts.length - 1] } }
    );
    patientConditions.push(
      { title: { contains: nameParts[0] } },
      { first_name: { contains: nameParts[1] } },
      { last_name: { contains: nameParts[2] } }
    );
  } else {
    patientConditions.push({ title: { contains: nameParts[0] } }, { first_name: { contains: nameParts[1] } }, { last_name: { contains: nameParts[2] } });
  }

  const where: Prisma.PatientWhereInput = {
    OR: [
      { case_no: { contains: searchTerm } },
      { hn: { contains: searchTerm } },
      { an: { contains: searchTerm } },
      { id_card: { contains: searchTerm } },
      { gender: { contains: translatedSearchTerm } },
      {
        InspectionType: {
          name: { contains: searchTerm },
        },
      },
      { hospital: { name: { contains: searchTerm } } },
      ...(dateSearch
        ? [
          {
            received_date: {
              gte: dateSearch,
            },
          },
        ]
        : []),
      ...patientConditions,
    ],
  };
  const searchTermAsNumber = Number(searchTerm);
  if (!isNaN(searchTermAsNumber)) {
    where.OR?.push({ age: { equals: searchTermAsNumber } });
  }
  const totalCount = await prisma.patient.count({ where });

  const patients = await prisma.patient.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      hospital: true,
      Lab: true,
      InspectionType: true,
    },
    orderBy: {
      [sort]: sortDirection as Prisma.SortOrder,
    },
  });

  const result = {
    items: patients,
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1,
      to: (page - 1) * limit + patients.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createPatient = async (
  data: PatientCreateFormData
): Promise<Patient> => {
  if (data.hn) {
    const exitsHN = await prisma.patient.findMany({
      where: {
        hn: data.hn,
      },
    });
    if (exitsHN.length > 0) {
      throw new ApiError(`HN: ${data.hn} already exists.`, 400);
    }
  }

  if (data.an) {
    const exitsAN = await prisma.patient.findMany({
      where: {
        an: data.an,
      },
    });
    if (exitsAN.length > 0) {
      throw new ApiError(`AN: ${data.an} already exists.`, 400);
    }
  }

  if (data.id_card) {
    const exitsCitizen = await prisma.patient.findMany({
      where: {
        id_card: data.id_card,
      },
    });
    if (exitsCitizen.length > 0) {
      throw new ApiError(`ID Card: ${data.id_card} already exists.`, 400);
    }
  }

  if (data.case_no) {
    const exitsCaseNo = await prisma.patient.findMany({
      where: {
        case_no: data.case_no,
      },
    });
    if (exitsCaseNo.length > 0) {
      throw new ApiError(`Case No: ${data.case_no} already exists.`, 400);
    }
  }

  const patient = await prisma.patient.create({
    data,
  });

  return patient;
};

export const updatePatient = async (
  patientData: PatientUpdateData,
  id: number
): Promise<Patient> => {
  const patientCheck = await prisma.patient.findUnique({
    where: { id },
  });
  if (patientCheck?.hn != patientData.hn) {
    const exitsHN = await prisma.patient.findMany({
      where: {
        hn: patientData.hn,
      },
    });
    if (exitsHN.length > 0) {
      throw new ApiError(`HN: ${patientData.hn} already exists.`, 400);
    }
  }

  if (patientCheck?.an != patientData.an) {
    const exitsAN = await prisma.patient.findMany({
      where: {
        an: patientData.an,
      },
    });
    if (exitsAN.length > 0) {
      if (exitsAN[0].an != patientData.an) {
        throw new ApiError(`AN: ${patientData.an} already exists.`, 400);
      }
    }
  }

  if (patientCheck?.id_card != patientData.id_card) {
    const exitsCitizen = await prisma.patient.findMany({
      where: {
        id_card: patientData.id_card,
      },
    });
    if (exitsCitizen.length > 0) {
      throw new ApiError(
        `ID Card: ${patientData.id_card} already exists.`,
        400
      );
    }
  }

  if (patientCheck?.case_no != patientData.case_no) {
    const exitsCaseNo = await prisma.patient.findMany({
      where: {
        case_no: patientData.case_no,
      },
    });
    if (exitsCaseNo.length > 0) {
      throw new ApiError(
        `Case No: ${patientData.case_no} already exists.`,
        400
      );
    }
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      hn: patientData.hn,
      an: patientData.an,
      id_card: patientData.id_card,
      first_name: patientData.first_name,
      last_name: patientData.last_name,
      gender: patientData.gender,
      case_no: patientData.case_no,
      hospital_id: patientData.hospital_id,
      age: patientData.age,
      phone_no: patientData.phone_no,
      visit_type: patientData.visit_type,
      sat_id: patientData.sat_id,
      is_anonymous: patientData.is_anonymous,
      date_of_birth: patientData.date_of_birth,
      date_of_send: patientData.date_of_send,
      collected_date: patientData.collected_date,
      received_date: patientData.received_date,
      inspection_type_id: patientData.inspection_type_id,
      collected_time: patientData.collected_time,
      received_time: patientData.received_time,
    },
  });

  return patient;
};

export const deletePatient = async (id: number): Promise<Patient> => {
  const patient = await prisma.patient.delete({
    where: { id },
  });

  return patient;
};

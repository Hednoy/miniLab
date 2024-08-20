import { NextRequest } from "next/server";
import ApiError from "@/lib-server/error";
import { de } from "@faker-js/faker";
import {
  deletePatient,
  getPatient,
  updatePatient,
} from "@/lib-server/services/patient";
import { PatientUpdateData } from "@/types/models/Patient";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("GET", slug);

    const id = parseInt(slug);

    const patient = await getPatient(id);

    return Response.json(patient);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("PUT", slug);

    const id = parseInt(slug);

    const data = (await request.json()) as PatientUpdateData;

    const patient = await updatePatient(data, id);

    return Response.json(patient);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("DELETE", slug);

    const id = parseInt(slug);

    const patient = await deletePatient(id);

    return Response.json(patient);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, PUT, DELETE };

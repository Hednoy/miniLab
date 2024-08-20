import {
  deleteOfficer,
  getOfficer,
  updateOfficer,
} from "@/lib-server/services/officer";
import { OfficerCreateFormData, OfficerUpdateData } from "@/types/models";
import { NextRequest } from "next/server";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("GET", slug);

    const id = parseInt(slug);

    const officer = await getOfficer(id);

    return Response.json(officer);
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

    const data = (await request.json()) as OfficerCreateFormData;

    const officer = await updateOfficer(id, data);

    return Response.json(officer);
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

    const role = await deleteOfficer(id);

    return Response.json(role);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, PUT, DELETE };

import { NextRequest } from "next/server";
import {
  deleteInspectionType,
  getInspectionType,
  updateInspectionType,
} from "@/lib-server/services/inspection-type";
import { InspectionTypeUpdateData } from "@/types/models/InspectionType";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("GET", slug);

    const id = parseInt(slug);

    const inspectionType = await getInspectionType(id);

    return Response.json(inspectionType);
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

    const data = (await request.json()) as InspectionTypeUpdateData;

    const inspectionType = await updateInspectionType(data, id);

    return Response.json(inspectionType);
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

    const inspectionType = await deleteInspectionType(id);

    return Response.json(inspectionType);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, PUT, DELETE };

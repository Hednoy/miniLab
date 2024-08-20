import { NextRequest } from "next/server";
import ApiError from "@/lib-server/error";
import { de } from "@faker-js/faker";
import { deleteLab, getLab, updateLab } from "@/lib-server/services/lab";
import { LabCreateFormData, LabUpdateData } from "@/types/models/Lab";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("GET", slug);

    const id = parseInt(slug);

    const lab = await getLab(id);

    return Response.json(lab);
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

    const data = (await request.json()) as LabCreateFormData;

    const lab = await updateLab(data, id);

    return Response.json(lab);
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

    const lab = await deleteLab(id);
    return Response.json(lab);
  } catch (e: any) {
    console.log(e);
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, PUT, DELETE };

import { NextRequest } from "next/server";
import ApiError from "@/lib-server/error";
import { de } from "@faker-js/faker";
import {
  deletePathogens,
  getPathogens,
  updatePathogens,
} from "@/lib-server/services/pathogens";
import { PathogensUpdateData } from "@/types/models/Pathogens";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("GET", slug);

    const id = parseInt(slug);

    const pathogens = await getPathogens(id);

    return Response.json(pathogens);
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

    const data = (await request.json()) as any;
    const pathogens = await updatePathogens(id, data);

    return Response.json(pathogens);
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
    const pathogens = await deletePathogens(id);

    return Response.json(pathogens);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, PUT, DELETE };

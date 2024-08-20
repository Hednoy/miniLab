import { NextRequest } from "next/server";
import ApiError from "@/lib-server/error";
import { de } from "@faker-js/faker";
import {
  deleteTestType,
  getTestType,
  updateTestType,
} from "@/lib-server/services/test-type";
import { TestTypeUpdateData } from "@/types/models/TestType";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("GET", slug);

    const id = parseInt(slug);

    const testType = await getTestType(id);

    return Response.json(testType);
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

    const data = (await request.json()) as TestTypeUpdateData;

    const testType = await updateTestType(id, data);

    return Response.json(testType);
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

    const testType = await deleteTestType(id);

    return Response.json(testType);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, PUT, DELETE };

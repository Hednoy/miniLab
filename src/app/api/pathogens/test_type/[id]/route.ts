import { NextRequest } from "next/server";
import ApiError from "@/lib-server/error";
import { de } from "@faker-js/faker";
import { getPathogensByTestTypeId } from "@/lib-server/services/pathogens";
import { PathogensUpdateData } from "@/types/models/Pathogens";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("GET", slug);

    const id = parseInt(slug);

    const pathogens = await getPathogensByTestTypeId(id);

    return Response.json(pathogens);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET };

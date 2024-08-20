import { NextRequest } from "next/server";
import {
  deleteAttachment,
  getAttachment,
  updateAttachment,
} from "@/lib-server/services/attachment";
import { AttachmentUpdateData } from "@/types/models/Attachment";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const slug = params.id;
    console.log("GET", slug);

    const id = parseInt(slug);

    const attachment = await getAttachment(id);

    return Response.json(attachment);
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

    const data = (await request.json()) as AttachmentUpdateData;

    const attachment = await updateAttachment(id, data);

    return Response.json(attachment);
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

    const attachment = deleteAttachment(id);

    return Response.json(attachment);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, PUT, DELETE };

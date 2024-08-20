import ApiError from "@/lib-server/error";
import {
  createAttachment,
  getAttachmentList,
} from "@/lib-server/services/attachment";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import {
  AttachmentCreateFormData,
  AttachmentsGetData,
} from "@/types/models/Attachment";
import { NextRequest } from "next/server";
import { z } from "zod";

const attachmentGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(stringToNumber, z.number().min(1).max(100).optional()),
  searchTerm: z.string().optional().or(z.literal("")),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal("asc"))
    .or(z.literal("desc")),
});

const validateAttachmentSearchQueryParams = (
  params: QueryParamsType
): AttachmentsGetData => {
  const result = attachmentGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as AttachmentsGetData;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateAttachmentSearchQueryParams(params);

    const attachments = await getAttachmentList(parsedData);

    return Response.json(attachments);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

const POST = async (request: NextRequest) => {
  try {
    const data = (await request.json()) as AttachmentCreateFormData;
    const attachment = await createAttachment(data);
    return Response.json(attachment);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET, POST };

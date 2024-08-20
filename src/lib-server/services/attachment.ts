import prisma from "@/lib-server/prisma";
import { Attachment, Prisma } from "@prisma/client";
import ApiError from "../error";
import {
  AttachmentCreateFormData,
  AttachmentUpdateData,
  AttachmentsGetData,
} from "@/types/models/Attachment";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";

export const getAttachment = async (id: number): Promise<Attachment> => {
  const attachment = await prisma.attachment.findUnique({
    where: { id },
    include: {
      Category: true,
      Officer: true,
      AttachmentLog: true,
    },
  });
  if (!attachment)
    throw new ApiError(`Attachment with id: ${id} not found.`, 404);

  return attachment;
};

export const getAttachmentList = async (
  attachmentGetData: AttachmentsGetData = {}
): Promise<PaginatedResponse<Attachment>> => {
  const {
    page = 1,
    limit = 999,
    searchTerm,
    sortDirection,
  } = attachmentGetData;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.AttachmentWhereInput = {};

  if (search) {
    where.name = { contains: search };
  }

  const totalCount = await prisma.attachment.count({ where });

  let attachments = await prisma.attachment.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      Category: true,
      Officer: true,
      AttachmentLog: true,
    },
    orderBy: {
      updated_at: sortDirection as SortDirection,
    },
  });

  attachments = Array.isArray(attachments) ? attachments : [];

  const result = {
    items: attachments.map((attachments) => attachments),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + attachments.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createAttachment = async (
  attachmentData: AttachmentCreateFormData
): Promise<Attachment> => {
  const attachment = await prisma.attachment.create({
    data: attachmentData,
  });

  return attachment;
};

export const updateAttachment = async (
  id: number,
  attachmentData: AttachmentUpdateData
): Promise<Attachment> => {
  const attachment = await prisma.attachment.update({
    where: { id },
    data: attachmentData,
  });

  return attachment;
};

export const deleteAttachment = async (id: number): Promise<Attachment> => {
  const attachment = await prisma.attachment.delete({ where: { id } });

  return attachment;
};

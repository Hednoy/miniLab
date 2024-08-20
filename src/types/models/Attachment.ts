import { SortDirection } from "..";
import { Attachment } from "@prisma/client";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Attachment
 */
export type AttachmentCreateData = Pick<
  Attachment,
  | "name"
  | "description"
  | "file_name"
  | "file_path"
  | "file_type"
  | "file_size"
  | "category_id"
  | "is_active"
>;

// both create and update
export type AttachmentCreateFormData = AttachmentCreateData;

/**
 * update Attachment
 */
export type AttachmentUpdateData = Partial<
  Pick<
    Attachment,
    | "name"
    | "description"
    | "file_name"
    | "file_path"
    | "file_type"
    | "file_size"
    | "category_id"
    | "is_active"
  >
>;

export type AttachmentUpdateMutationData = {
  attachment: AttachmentUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services
export type AttachmentsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sortDirection: SortDirection;
}>;

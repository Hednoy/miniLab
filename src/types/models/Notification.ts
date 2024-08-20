import { Notification } from "@prisma/client";
import { SortDirection } from "..";

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create Notification
 */
export type NotificationCreateData = Pick<
  Notification,
  "name" | "description" | "is_active"
>;

// both create and update
export type NotificationCreateFormData = NotificationCreateData;

/**
 * update Notification
 */
export type NotificationUpdateData = Partial<
  Pick<Notification, "name" | "description" | "is_active">
>;

export type NotificationUpdateMutationData = {
  notification: NotificationUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries, api args validation and services

export type NotificationsGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  createdDate: string;
  sortDirection: SortDirection;
}>;

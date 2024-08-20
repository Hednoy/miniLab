import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

// ------------ Shared types

/**
 * paginated response for posts and users
 */
export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    total: number;
    pagesCount: number;
    currentPage: number;
    perPage: number;
    from: number;
    to: number;
    hasMore: boolean;
  };
};

export const defaultPagination = {
  total: 0,
  pagesCount: 0,
  currentPage: 0,
  perPage: 0,
  from: 0,
  to: 0,
  hasMore: false,
};

export type SortDirection = "asc" | "desc";

// ------------ Next.js types

/**
 * api NextApiRequest req.query
 */
export type QueryParamsType = Partial<{
  [key: string]: string | string[];
}>;

/**
 * getServerSideProps req
 */
export type NextReq = IncomingMessage & {
  cookies: NextApiRequestCookies;
};

/**
 * ErrorBoundary and Loader fallback type
 */
export type FallbackType = "screen" | "page" | "item" | "test";

/**
 * all props in object non-nullable
 */
export type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

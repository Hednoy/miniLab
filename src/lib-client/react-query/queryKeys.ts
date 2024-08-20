const QueryKeys = {
  POSTS_HOME: "posts-home",
  POSTS_PROFILE: "posts-profile",
  POSTS_DRAFTS: "posts-drafts",
  POST: "post",
  USER: "user",
  ME: "me",
  USERS: "users",
  IMAGE: "image",
  CATEGORY: "category",
  CATEGORIES: "categories",
  REPORT_PROVINCE: "report-province",
  PERSON: "person",
  PROVINCES: "provinces",
  AMPHURES: "amphures",
  TAMBONS: "tambons",
  SERVICE: "service",
  SERVICE_TYPE: "service-type",
  ORGANIZATION: "organization",
  AGENT: "agent",
  HOSPITAL: "hospital",
  PATIENT: "patient",
  TEST_TYPE: "test-type",
  LAB: "lab",
  ATTACHMENT: "attachment",
  DASHBOARD: "dashboard",
  DASHBOARD_CHART: "dashboard-chart",
  DASHBOARD_PATHOGENS: "dashboard-pathogens",
  DASHBOARD_REPORT: "dashboard-report",
  NEWS: "news",
  NEWS_TYPE: "news-type",
  PATHOGENTS: "pathogens",
  MACHINE: "machine",
  INSPECTION_TYPE: "inspection-type",
  ROLE: "role",
  OFFICER: "officer",
  LOG_OFFICER: "log-officer",
  DETECTION_METHOD: "detection-method",
} as const;

export type QueryKeysType = (typeof QueryKeys)[keyof typeof QueryKeys];

export const filterEmptyKeys = (
  queryKey: Array<string | number | undefined | null>
) => {
  return queryKey.filter((item) => item || item === 0) as Array<
    string | number
  >;
};

export default QueryKeys;

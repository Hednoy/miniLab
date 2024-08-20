export const Routes = {
  SITE: {
    HOME: "/",
    GUEST: {
      ABOUT: "/guest/about",
      STEP: "/guest/step",
      NEWS: "/guest/news",
      CONTENTS: "/guest/contents",
      CONTENTDETAIL: "/guest/contents/[id]",
      FAQ: "/guest/faq",
      CONTACT: "/guest/contact",
    },

    LOGIN_USER: "/auth/loginUser/",
    LOGIN_AGENT: "/auth/loginAgent/",
    LOGIN: "/auth/login/",
    SETTINGS: "/settings/",
    USERS: "/users/",
    _500: "/500/",
    MEMBER: {
      AGREE: "/auth/agree/",
      REGISTER: "/auth/register/",
    },
    BACKOFFICE: {
      HOME: "/backoffice",
      USERS: "/backoffice/users",
      POSTS: "/backoffice/posts",
      SERVICE_TYPE: "/backoffice/service-type",
      CATEGORIES: "/backoffice/categories",
      PEOPLE: "/backoffice/people",
      CHANNELS: "/backoffice/channels",
      PROCESSING_TIME: "/backoffice/processing-time",
      OFFICEMANAGER: "/backoffice/office-manager",
      SERVICE: "/backoffice/service",
      REPORTS: "/backoffice/reports",
      DASHBOARD: "/backoffice/dashboard",
      PEOPLE_SERVICE: "/backoffice/people-service",
      DEPARTMENT_SERVICE: "/backoffice/department-service",
      RECEIVE_SERVICE: "/backoffice/receive-service",
      SERRCH_SERVICE: "/backoffice/search-service",
      REPORT: "/backoffice/report",
      SEARCH: "/backoffice/search",
      AREA: "/backoffice/area",
      AREA_DETAIL: "/backoffice/area/[id]",
      PAGE_MANAGEMENT: "/backoffice/page-management",
      FAQ: "/backoffice/faq",
      NEWS: "/backoffice/news",
      ROLE: "/backoffice/role",
      ROLE_PREMISSION: "/backoffice/role-permission",
      ROLE_DETAIL: "/backoffice/role/[id]",
    },
    DASHBOARD: {
      HOME: "/dashboard",
    },
    OTHER: {
      HOSPITAL: "/other/hospital",
      INSPECTION_TYPE: "/other/inspection-type",
      TEST_TYPE: "/other/test-type",
      PATHOGENTS: "/other/pathogens",
    },
    PATIENT: {
      HOME: "/patient",
    },
    NEWS: {
      HOME: "/news",
    },
    MANAGEMENT: {
      ROLE: "/management/role",
      OFFICER: "/management/officer",
    },
    LAB: {
      HOME: "/laboratory",
    },
  },
  API: {
    POSTS: "/api/posts/",
    USERS: "/api/users/",
    PROFILE: "/api/users/profile/",
    SESSION: "/api/auth/session/",
    SEED: "/api/seed/",
    REPORT_PROVINCE: "/api/report/province/",
    REPORT_COUNTRY: "/api/report/province/",
    CATEGORIES: "/api/categories/",
    PERSON: "/api/person",
    PROVINCES: "/api/address/provinces",
    AMPHURES: "/api/address/amphures",
    TAMBONS: "/api/address/tambons",
    SERVICE: "/api/service",
    SERVICE_TYPE: "/api/service/type",
    AGENTS: "/api/agents/",
    ORGANIZATIONS: "/api/organization",
    CHANNEL: "/api/channel",
    HOSPITAL: "/api/hospital",
    PATIENT: "/api/patient",
    TEST_TYPE: "/api/test-type",
    LAB_TEST: "/api/labtest",
    ATTACHMENT: "/api/attachment",
    DASHBOARD: "/api/dashboard",
    DASHBOARD_CHART: "/api/dashboard/chart",
    DASHBOARD_CHART_PATHOGENS: "/api/dashboard/chart/pathogens",
    DASHBOARD_REPORT: "/api/dashboard/report",
    NEWS: "/api/news",
    NEWS_TYPE: "/api/news-type",
    PATHOGENTS: "/api/pathogens",
    MACHINE: "/api/machine",
    INSPECTION_TYPE: "/api/inspection-type",
    LAB: "/api/lab",
    UPLOAD: "/api/upload",
    ROLE: "/api/role",
    OFFICER: "/api/officer",
    LOG_OFFICER: "/api/log/officer",
    DETECTION_METHOD: "/api/test-type/list",
  },
  STATIC: {
    // repeated in folder structure, static folder, seed
    // docker volumes prod, Dockerfile.prod, gitignore
    // Routes.STATIC.AVATARS, Routes.STATIC.HEADERS - constants, not env vars
    AVATARS: "/uploads/avatars/",
    HEADERS: "/uploads/headers/",
  },
} as const;

// ----------- redirects getServerSideProps

export const Redirects = {
  NOT_FOUND: {
    notFound: true,
  },
  _500: {
    redirect: {
      permanent: false,
      destination: Routes.SITE._500,
    },
  },
  LOGIN: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.LOGIN_USER,
    },
  },
  HOME: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.HOME,
    },
  },
} as const;

// ----------- themes array

export const themes = [
  "theme-light",
  "theme-dark",
  "theme-blue",
  "theme-red",
  "theme-green",
  "theme-black",
];

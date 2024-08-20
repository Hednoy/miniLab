export const uniqueString = (length: number) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isBrowser = () => typeof window !== "undefined";

/**
 * min, max included
 */
export const getRandomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isUrl = (str: string) => {
  return /^https?:\/\//gi.test(str);
};

/**
 * in seconds
 */
export const sleep = (seconds: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));
};

// this is not perfect, should be called in all jest.config.js
// jest imports with node, not ts-node
export const isGithubActionsAppEnv = (): boolean => {
  return process.env.APP_ENV === "ci";
};

/**
 * Note: this might give wrong path in tests
 */
export const rootDirAbsolutePath = process.cwd();

/**
 * filter special chars and replace spaces with '_'
 */
export const filterSearchTerm = (
  searchTerm: string | undefined,
  operator: "space" | "or" = "space"
): string | undefined => {
  // 'cat_dog' matches 'cat dog'
  const joinBy = operator === "space" ? "_" : " | ";

  return (
    searchTerm &&
    searchTerm
      .trim()
      .replace(/[^a-z0-9ก-๙\s]+/gi, "") // remove special chars
      .split(/\s+/)
      .join(joinBy)
  );
};

//create function receive data and check isAdmin or not
export const isAdmin = (user: any): boolean => {
  return user.role_id === 1;
};

export const digitsOnly = (value: any) => /^\d+$/.test(value);

export const convertToThaiFormat = (dateString: string) => {
  const parts = dateString.split("/");
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  return `${day}/${month}/${Number(year) + 543}`;
};

export const convertToThaiFormatTime = (dateString: string) => {
  const parts = dateString.split("/");
  const day = parts[0];
  const month = parts[1];
  const year = parts[2].split(" ")[0];
  const time = parts[2].split(" ")[1];
  return `${day}/${month}/${Number(year) + 543} ${time}`;
};

export const convertDateToString = (date: Date | null): string => {
  if (!date) {
    return "";
  }
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString();
  const dd = date.getDate().toString();

  return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
};

export const convertDateToStringWithTime = (date: Date | null): string => {
  if (!date) {
    return "";
  }
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString();
  const dd = date.getDate().toString();

  const hours = date.getHours().toString();
  const minutes = date.getMinutes().toString();

  return `${dd.padStart(2, "0")}/${mm.padStart(
    2,
    "0"
  )}/${yyyy} ${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

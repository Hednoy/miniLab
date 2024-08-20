import { AxiosError } from "axios";
import axiosInstance from "./react-query/axios";
import { Routes } from "./constants";

type UploadResponse = {
  new_file_name: string;
  old_file_name: string;
  path: string;
  size: number;
};

export const UtilityUpload = (
  file: File
): Promise<UploadResponse | AxiosError> => {
  return new Promise<UploadResponse | AxiosError>((resolve) => {
    const formData = new FormData();
    formData.append("files", file);
    axiosInstance
      .post(Routes.API.UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (resp: any) => {
        return resolve(resp.data);
      })
      .catch(async (errors: AxiosError) => {
        return resolve(errors);
      });
  });
};

import { AppConstants } from "@/constant/keys";
import { getValueFromLS } from "@/lib/utils";
import axios from "axios";

// Config file for changing or adding options to the axios instance

export const AxiosInstanceConfig = {
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
};

// defining axios instance
const axiosInstance = axios.create({
  ...AxiosInstanceConfig,
  baseURL: import.meta.env.BASE_URL,
});

async function axiosRequest({ ...options }) {
  const AUTH_TOKEN = getValueFromLS(AppConstants.GET_TOKEN_FROM_LS);
  //   axiosInstance.defaults.headers.common.Authorization = AUTH_TOKEN;

  if (AUTH_TOKEN) {
    axiosInstance.defaults.headers.Authorization = AUTH_TOKEN;
  }
  try {
    const response = await axiosInstance(options);
    return Promise.resolve(response.data);
  } catch (error) {
    console.log(error, "This is error");
    throw error;
  }
}

export const customAxiosRequestForGet = async (url: string) => {
  const userId = getValueFromLS(AppConstants.GET_USER_ID_FROM_LS);
  let paramsToPass = {};
  if (!userId) {
    throw new Error("User id is not present");
  }

  if (userId) {
    paramsToPass = { userId };
  }

  // console.log(paramsToPass, ":::params to pass");
  const response = await axiosRequest({
    url,
    method: "get",
    params: paramsToPass,
  });
  return response;
};

export const customAxiosRequestForPost = async (url: string, method = "post", payload: any) => {
  const userId = getValueFromLS(AppConstants.GET_USER_ID_FROM_LS);

  let updatedPayload = { ...payload };
  if (userId) {
    updatedPayload = { ...payload, userId };
  }

  console.log({ updatedPayload });
  //   try {
  //     const response = await axiosRequest({
  //       url,
  //       method,
  //       data: updatedPayload,
  //     });
  //     return response;
  //   } catch (error) {
  //     console.log(error);
  //     throw error; // Re-throw the error to propagate it to the caller
  //   }
};

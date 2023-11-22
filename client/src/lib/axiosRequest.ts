import { AppConstants } from "@/constant/keys";
import { getValueFromLS } from "@/lib/utils";
import axios from "axios";

interface IPayload {
  [key: string]: string | boolean | null | File[] | Date;
}
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
  baseURL: import.meta.env.VITE_BASE_URL,
});

async function axiosRequest({ ...options }) {
  const storedData = getValueFromLS(AppConstants.USER_DETAILS);

  const AUTH_TOKEN = storedData ? JSON.parse(storedData).tokens[0].token : null;
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

export const customAxiosRequestForGet = async (url: string, id: string | null) => {
  const storedData = getValueFromLS(AppConstants.USER_DETAILS);
  const userId = storedData && JSON.parse(storedData)._id;
  let paramsToPass = {};
  if (!userId) {
    throw new Error("User id is not present");
  }

  if (userId) {
    paramsToPass = { userId };
  }

  if (id) {
    paramsToPass = { ...paramsToPass, id };
  }

  // console.log(paramsToPass, ":::params to pass");
  const response = await axiosRequest({
    url,
    method: "get",
    params: paramsToPass,
  });
  return response;
};

export const customAxiosRequestForPost = async (url: string, method = "post", payload: IPayload) => {
  const storedData = getValueFromLS(AppConstants.USER_DETAILS);
  const userId = storedData && JSON.parse(storedData)?._id;

  let updatedPayload = { ...payload };
  if (userId) {
    updatedPayload = { ...payload, userId };
  }

  try {
    const response = await axiosRequest({
      url,
      method,
      data: updatedPayload,
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

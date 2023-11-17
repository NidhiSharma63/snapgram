import { AppConstants } from "@/constant/keys";
import { getValueFromLS } from "@/lib/utils";
import axios from "axios";

interface IPayload {
  [key: string]: string | boolean | null;
}
// Config file for changing or adding options to the axios instance

const storedData = getValueFromLS(AppConstants.USER_DETAILS);

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
console.log(storedData, "stored data");

async function axiosRequest({ ...options }) {
  console.log(storedData !== "null");
  const AUTH_TOKEN = storedData !== "null" ? JSON.parse(storedData).tokens[0].token : null;
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
  const userId = storedData && JSON.parse(storedData)._id;
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
const val = import.meta.env.VITE_BASE_URL;
console.log({ val });

export const customAxiosRequestForPost = async (url: string, method = "post", payload: IPayload) => {
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

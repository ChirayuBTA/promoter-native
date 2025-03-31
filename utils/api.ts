import { queryString } from "@/helper";
import { handleResponse } from "@/helper/handle-response";
import {
  authHeaders,
  formHeaders,
  imageHeaders,
} from "@/helper/request-headers";
import { apiUrl } from "@/lib/apiConfig";

export const api = {
  sendOTP: async function (body: ISendOTPRequestBody) {
    const reqOptions = {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include" as RequestCredentials,
      headers: authHeaders(),
    };
    return fetch(`${apiUrl}/auth/send-otp`, reqOptions).then(handleResponse);
  },
  verifyOTP: async function (body: IVerifyOTPRequestBody) {
    const reqOptions = {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include" as RequestCredentials,
      headers: authHeaders(),
    };
    return fetch(`${apiUrl}/auth/verify-otp`, reqOptions).then(handleResponse);
  },
  createOrderEntry: async function (body: FormData) {
    console.log(body);
    const reqOptions = {
      method: "POST",
      body,
      credentials: "include" as RequestCredentials,
      headers: formHeaders(),
    };
    return fetch(`${apiUrl}/order`, reqOptions).then(handleResponse);
  },
  uploadImages: async function (body: FormData) {
    console.log(body);
    const reqOptions = {
      method: "POST",
      body,
      credentials: "include" as RequestCredentials,
      headers: imageHeaders(),
    };
    return fetch(`${apiUrl}/app/uploadImages`, reqOptions).then(handleResponse);
  },
  getCities: async function (query: any) {
    return fetch(`${apiUrl}/app/getAllCities?${queryString(query)}`, {
      headers: authHeaders(),
      cache: "no-store",
    }).then(handleResponse);
  },
  getSocities: async function (query: any) {
    return fetch(
      `${apiUrl}/app/getAllActivityLocations?${queryString(query)}`,
      {
        headers: authHeaders(),
        cache: "no-store",
      }
    ).then(handleResponse);
  },
  getSocityById: async function (id: string) {
    return fetch(`${apiUrl}/soc/${id}`, {
      headers: authHeaders(),
      cache: "no-store",
    }).then(handleResponse);
  },
  // getDashboardData: async function (socId: string, promoterId: string) {
  //   return fetch(
  //     `${apiUrl}/app/getDashboardData?activityLocId=${socId}&promoterId=${promoterId}`,
  //     {
  //       headers: authHeaders(),
  //       cache: "no-store",
  //     }
  //   ).then(handleResponse);
  // },
  getDashboardData: async function (query: any) {
    return fetch(`${apiUrl}/app/getDashboardData?${queryString(query)}`, {
      headers: authHeaders(),
      cache: "no-store",
    }).then(handleResponse);
  },
};

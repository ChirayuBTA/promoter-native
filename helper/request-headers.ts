import { x_api_key } from "@/lib/apiConfig";
import { getAuthValue, isAuthenticated, clearAuthData } from "@/utils/storage";

export async function authHeaders(
  isMultipartData: boolean = false
): Promise<HeadersInit> {
  // const token = localStorage.getItem("token");
  const token = await getAuthValue("token");
  console.log("token--", token);

  return {
    "x-api-key": x_api_key,
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "69420",
    Accept: "application/json",
    ...(!isMultipartData && {
      "Content-Type": "application/json",
    }),
  };
}
export async function imageHeaders(
  isMultipartData: boolean = false
): Promise<HeadersInit> {
  // const token = localStorage.getItem("token");
  const token = await getAuthValue("token");
  return {
    "x-api-key": x_api_key,
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "69420",
  };
}

export function headers(isMultipartData: boolean = false): HeadersInit {
  return {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
    ...(!isMultipartData && {
      "Content-Type": "application/json",
    }),
  };
}
export async function formHeaders(
  isMultipartData: boolean = false
): Promise<HeadersInit> {
  const token = await getAuthValue("token");
  console.log("token--", token);
  return {
    "x-api-key": x_api_key,
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "69420",
  };
}

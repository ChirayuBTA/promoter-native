import { clearAuthData, clearLocData } from "@/utils/storage";
import { router } from "expo-router";
import { Alert } from "react-native";

export async function handleResponse(response: Response) {
  return response.text().then(async (text) => {
    const data = text && JSON.parse(text);

    if (data?.message === "Unauthorized: Invalid token") {
      await clearAuthData();
      await clearLocData();
      router.replace("/"); // Redirect to login page
      // Alert.alert("Error", "You have been logged out.");
      return Promise.reject(new Error("You have logged in on another device"));
    }

    if (data?.message === "Unauthorized: Invalid session") {
      await clearAuthData();
      await clearLocData();
      router.replace("/"); // Redirect to login page
      // Alert.alert("Error", "You have been logged out.");
      return Promise.reject(new Error("Your sessions has expired"));
    }

    if (!response.ok) {
      return Promise.reject(new Error(data?.message || "Something went wrong"));
    }

    return data;
  });
}

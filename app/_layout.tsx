import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./globals.css";
import CustomHeader from "@/components/CustomHeader";

export default function Layout() {
  return (
    <SafeAreaProvider>
      {/* Stack with all screens */}
      <Stack
        screenOptions={{
          headerShown: false, // Hide default headers
          // header: () => <CustomHeader />,
        }}
      />
      {/* Status bar configuration */}
      <StatusBar style="dark" backgroundColor="#ffffff" />
    </SafeAreaProvider>
  );
}

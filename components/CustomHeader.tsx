import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { LogOut } from "lucide-react-native";
import { clearAuthData, clearLocData } from "@/utils/storage";
import DropdownMenu from "./DropdownMenu";
import { MenuTrigger } from "./MenuTrigger";
import { MenuOption } from "./MenuOption";

const CustomHeader = ({ isLocationScreen }: { isLocationScreen?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleResetSettings = async () => {
    await clearLocData();
    router.replace("/location");
  };

  const handleUploadImages = () => {
    router.push("/uploadImages");
  };

  const handleLogout = async () => {
    await clearLocData();
    await clearAuthData();
    router.replace("/");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "white",
      }}
    >
      {/* Logo */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>DIRECT</Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "red" }}>
          X
        </Text>
      </View>

      {isLocationScreen ? (
        <TouchableOpacity style={{ padding: 8 }} onPress={handleLogout}>
          <LogOut size={22} color="red" />
        </TouchableOpacity>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Show Home icon only if not on /dashboard */}
          {pathname !== "/dashboard" && (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => router.push("/dashboard")}
            >
              <Ionicons name="home-outline" size={28} color="black" />
            </TouchableOpacity>
          )}

          {/* Dropdown Menu */}
          <DropdownMenu
            trigger={(onPress) => (
              <MenuTrigger onPress={onPress}>
                <Ionicons name="menu" size={28} color="black" />
              </MenuTrigger>
            )}
          >
            <MenuOption onSelect={handleResetSettings}>
              Reset Settings
            </MenuOption>
            <MenuOption onSelect={handleUploadImages}>
              Society Images Upload
            </MenuOption>
            <MenuOption onSelect={handleLogout}>Logout</MenuOption>
          </DropdownMenu>
        </View>
      )}
    </View>
  );
};

export default CustomHeader;

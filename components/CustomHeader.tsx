import React from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { LogOut } from "lucide-react-native";
import {
  clearAuthData,
  clearLocData,
  getLocData,
  getAuthData,
} from "@/utils/storage";
import DropdownMenu from "./DropdownMenu";
import { MenuTrigger } from "./MenuTrigger";
import { MenuOption } from "./MenuOption";

const CustomHeader = ({ isLocationScreen }: { isLocationScreen?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleResetSettings = async () => {
    Alert.alert("Reset?", `Are you sure you want to reset your settings?`, [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await clearLocData();
          router.replace("/location");
        },
      },
    ]);
  };

  const handleUploadImages = () => {
    router.push("/uploadImages");
  };

  const handleLogout = async () => {
    Alert.alert("Logout?", `Are you sure you want to logout?`, [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await clearLocData();
          await clearAuthData();

          router.replace("/");
        },
      },
    ]);
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
        {/* <Text style={{ fontSize: 24, fontWeight: "bold" }}>DIRECT</Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "red" }}>
          X
        </Text> */}
        <Image
          source={require("@/assets/images/appLogo.png")}
          style={{ width: 80, height: 40, resizeMode: "contain" }}
        />
      </View>

      {isLocationScreen ? (
        <TouchableOpacity style={{ padding: 8 }} onPress={handleLogout}>
          <LogOut size={22} color="red" />
        </TouchableOpacity>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Show Home icon only if not on /dashboard */}
          {/* {pathname !== "/dashboard" && ( */}
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => router.replace("/dashboard")}
          >
            <Ionicons name="home-outline" size={28} color="black" />
          </TouchableOpacity>
          {/* )} */}

          {/* Dropdown Menu */}
          <DropdownMenu
            trigger={(onPress) => (
              <MenuTrigger onPress={onPress}>
                <Ionicons name="menu" size={28} color="black" />
              </MenuTrigger>
            )}
          >
            <MenuOption
              onSelect={handleResetSettings}
              icon={<Ionicons name="refresh" size={20} color="black" />}
            >
              Reset Settings
            </MenuOption>

            <MenuOption
              onSelect={handleUploadImages}
              icon={<Ionicons name="image" size={20} color="black" />}
            >
              Event Images Upload
            </MenuOption>

            <MenuOption
              onSelect={handleLogout}
              icon={<Ionicons name="log-out-outline" size={20} color="red" />}
            >
              Logout
            </MenuOption>
          </DropdownMenu>
        </View>
      )}
    </View>
  );
};

export default CustomHeader;

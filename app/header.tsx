import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert,Platform  } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Appbar } from "react-native-paper"; // Using Paper for header and icon buttons

const Header = () => {
  const router = useRouter();

  // Handle Menu Actions
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => router.push("/auth/login") }, // Replace with your login screen
    ]);
  };

  const handleResetSettings = () => {
    Alert.alert("Reset Settings", "Are you sure you want to reset settings?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", onPress: () => console.log("Settings reset!") }, // Implement reset logic here
    ]);
  };

  const handleUploadImages = () => {
    router.push("/uploadImages"); // Replace with your upload images screen route
  };

  return (
    <Appbar.Header style={{ backgroundColor: "#1F2937", flexDirection: "row", alignItems: "center" }}>
      {/* Logo and Title Container */}
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
      <Image
          source={require("../assets/images/DirectX-Logo.png")} // Replace with actual logo path
          style={{
            width: Platform.OS === "ios" ? 200 : 250, // Dynamic width based on platform (iOS vs Android)
            height: 40,
            marginRight: 10,
            resizeMode: "contain", // Keeps the aspect ratio of the logo intact
          }}
        />
 
      </View>

      {/* Menu Options */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={handleUploadImages}>
          <Ionicons name="cloud-upload-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResetSettings} style={{ marginLeft: 15 }}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 15 }}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Appbar.Header>
  );
};

export default Header;

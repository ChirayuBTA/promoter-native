import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../utils/api"; // Import API methods
import { getAuthValue, getLocData, getLocValue } from "@/utils/storage";
import CustomHeader from "@/components/CustomHeader";

const CreateScreen = () => {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [orderImage, setOrderImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [storageData, setStorageData] = useState<{
    activityId: string;
    activityLocId: string;
    promoterId: string;
    vendorId: string;
    projectId: string;
  }>({
    activityId: "",
    activityLocId: "",
    promoterId: "",
    vendorId: "",
    projectId: "",
  });

  const router = useRouter();

  const fetchAuthData = async () => {
    const activityId = await getLocValue("activityId");
    const activityLocId = await getLocValue("activityLocId");
    const projectId = await getAuthValue("projectId");
    const vendorId = await getAuthValue("vendorId");
    const promoterId = await getAuthValue("promoterId");

    setStorageData({
      activityId: activityId,
      activityLocId: activityLocId,
      promoterId: promoterId,
      vendorId: vendorId,
      projectId: projectId,
    });
  };

  useEffect(() => {
    fetchAuthData();
  }, []);

  // Handle Image Selection / Capture
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false, // Disable cropping
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setOrderImage(result.assets[0].uri);
    }
  };

  // Handle Taking a Picture
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false, // Disable cropping
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setOrderImage(result.assets[0].uri);
    }
  };

  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takeProfilePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Handle Submit
  const handleSubmit = () => {
    if (![orderImage].every(Boolean)) {
      return Alert.alert(
        "Error",
        // "Please fill all fields and upload an image."
        "Please upload order image."
      );
    }

    setIsLoading(true);

    const formData = new FormData();
    Object.entries({
      promoterId: storageData.promoterId,
      projectId: storageData.projectId,
      activityLocId: storageData.activityLocId,
      vendorId: storageData.vendorId,
      activityId: storageData.activityId,
    }).forEach(([key, value]) => formData.append(key, value));

    name && formData.append("name", name);
    phone && formData.append("phone", phone);

    formData.append("orderImage", {
      uri: orderImage,
      name: `photo_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    profileImage &&
      formData.append("profileImage", {
        uri: profileImage,
        name: `profile_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);
    console.log("formData", formData);

    api
      .createOrderEntry(formData)
      .then((response) => {
        Alert.alert(
          response?.success ? "Success" : "Error",
          response?.message || "Failed to create entry."
        );
        if (response?.success) router.replace("/dashboard");
      })
      .catch((error) => {
        console.error("Upload Error:", error.message);
        Alert.alert(
          "Error",
          error.message ||
            "Please check your internet connection and try again."
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <CustomHeader />

      {/* Main Card */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white mx-4 my-4 rounded-3xl shadow-md p-6">
          <View className="mx-4 my-4 rounded-3xl p-6">
            <Text className="text-2xl font-bold text-center text-primary mb-6">
              Create New Entry
            </Text>

            {/* Name Input */}
            <Text className="text-sm font-medium text-gray-700 mb-2">Name</Text>
            <TextInput
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 mb-4 text-lg text-black"
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
            />

            {/* Phone Input */}
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Phone
            </Text>
            <TextInput
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 mb-4 text-lg text-black"
              placeholder="Enter phone number"
              maxLength={10}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
            />

            {/* Image Upload */}
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Order Image
              <Text className="text-primary"> *</Text>
            </Text>
            <View className="flex-row gap-4 space-x-4 mb-4">
              {/* Select from Gallery */}
              <TouchableOpacity
                onPress={pickImage}
                className="flex-1 items-center justify-center bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
              >
                <Ionicons name="image" size={24} color="#f89f22" />
                <Text className="text-sm text-gray-600 mt-2">Select Photo</Text>
              </TouchableOpacity>

              {/* Take a Photo */}
              <TouchableOpacity
                onPress={takePhoto}
                className="flex-1 items-center justify-center bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
              >
                <Ionicons name="camera" size={24} color="#f89f22" />
                <Text className="text-sm text-gray-600 mt-2">Take Photo</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Image Upload */}
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </Text>
            <View className="flex-row gap-4 space-x-4 mb-4">
              {/* Select Profile Image */}
              <TouchableOpacity
                onPress={pickProfileImage}
                className="flex-1 items-center justify-center bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
              >
                <Ionicons name="image" size={24} color="#f89f22" />
                <Text className="text-sm text-gray-600 mt-2">Select Photo</Text>
              </TouchableOpacity>

              {/* Take Profile Photo */}
              <TouchableOpacity
                onPress={takeProfilePhoto}
                className="flex-1 items-center justify-center bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
              >
                <Ionicons name="camera" size={24} color="#f89f22" />
                <Text className="text-sm text-gray-600 mt-2">Take Photo</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-evenly space-x-4 mb-4">
              {/* Preview Image */}
              {orderImage && (
                <View className="items-center mb-4">
                  <Image
                    source={{ uri: orderImage }}
                    className="w-32 h-32 rounded-xl border border-gray-300"
                  />
                  <TouchableOpacity
                    onPress={() => setOrderImage(null)}
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                  <Text className="text-sm text-gray-600 mt-2">
                    Order Image
                  </Text>
                </View>
              )}

              {/* Preview Profile Image */}
              {profileImage && (
                <View className="items-center mb-4">
                  <Image
                    source={{ uri: profileImage }}
                    className="w-32 h-32 rounded-xl border border-gray-300"
                  />
                  <TouchableOpacity
                    onPress={() => setProfileImage(null)}
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                  <Text className="text-sm text-gray-600 mt-2">
                    Profile Image
                  </Text>
                </View>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl ${
                orderImage ? "bg-primary" : "bg-gray-300"
              } items-center shadow-md`}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg font-semibold">Submit</Text>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-full py-4 rounded-xl bg-white border border-gray-300 items-center mt-4 shadow-sm"
            >
              <Text className="text-gray-700 text-lg font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateScreen;

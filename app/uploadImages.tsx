import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../utils/api"; // Import API methods
import CustomHeader from "@/components/CustomHeader";
import { getLocValue } from "@/utils/storage";

const CreateScreen = () => {
  const [images, setImages] = useState<string[]>([]); // Store multiple images
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activityId, setActivityId] = useState("");

  const router = useRouter();

  const fetchActivityId = async () => {
    const societyId = await getLocValue("societyId");

    setActivityId(societyId);
  };

  useEffect(() => {
    fetchActivityId();
  }, []);

  // Handle selecting multiple images from the gallery
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Enable multiple selection
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  // Handle taking multiple photos and appending them
  const takePhoto = async () => {
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
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  // Handle submit (uploads images)
  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert("Error", "Please upload at least one image.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    try {
      for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i]);
        const blob = await response.blob();

        formData.append("images", {
          uri: images[i],
          name: `photo_${Date.now()}_${i}.jpg`,
          type: "image/jpeg",
        } as any);
      }
      formData.append("activityLocId", activityId);
      const response = await api.uploadImages(formData);

      if (response.success) {
        Alert.alert("Success", "Images uploaded successfully!");
        router.replace("/dashboard");
      } else {
        Alert.alert("Error", "Failed to upload Images.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove selected image
  const removeImage = (uri: string) => {
    setImages((prevImages) => prevImages.filter((image) => image !== uri));
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Ensure header is fixed at the top */}
      <View className="absolute top-0 left-0 right-0 z-10">
        <CustomHeader />
      </View>

      {/* Content inside SafeAreaView */}
      <SafeAreaView className="flex-1 mt-[60px]">
        <View className="mx-4 my-4 rounded-3xl p-6">
          {/* Header */}
          <Text className="text-2xl font-bold text-center text-red-500 mb-6">
            Upload Event Images
          </Text>

          {/* Image Upload */}
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Select Photos
          </Text>
          <View className="flex-row space-x-4 mb-4">
            {/* Select from Gallery */}
            <TouchableOpacity
              onPress={pickImages}
              className="flex-1 items-center justify-center bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
            >
              <Ionicons name="image" size={24} color="#E53E3E" />
              <Text className="text-sm text-gray-600 mt-2">Select Photos</Text>
            </TouchableOpacity>

            {/* Take a Photo */}
            <TouchableOpacity
              onPress={takePhoto}
              className="flex-1 items-center justify-center bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
            >
              <Ionicons name="camera" size={24} color="#E53E3E" />
              <Text className="text-sm text-gray-600 mt-2">Take Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Preview Images */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            {images.map((uri, index) => (
              <View key={index} className="relative mr-4">
                <Image
                  source={{ uri }}
                  className="w-32 h-32 rounded-xl border border-gray-300"
                />
                {/* Cross icon to remove image */}
                <TouchableOpacity
                  onPress={() => removeImage(uri)}
                  className="absolute top-0 right-0 bg-white p-1 rounded-full"
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl ${
              images.length > 0 ? "bg-red-500" : "bg-gray-300"
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
      </SafeAreaView>
    </View>
  );
};

export default CreateScreen;

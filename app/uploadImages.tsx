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
  const [activityLocId, setActivityLocId] = useState("");

  const router = useRouter();

  const fetchActivityId = async () => {
    const activityLocId = await getLocValue("activityLocId");

    setActivityLocId(activityLocId);
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
  const handleSubmit = () => {
    if (!images.length) {
      Alert.alert("Error", "Please upload at least one image.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    Promise.all(
      images.map((uri, index) =>
        Promise.resolve().then(() => {
          formData.append("images", {
            uri,
            name: `photo_${Date.now()}_${index}.jpg`,
            type: "image/jpeg",
          } as any);
        })
      )
    )
      .then(() => {
        formData.append("activityLocId", activityLocId);
        return api.uploadImages(formData);
      })
      .then(({ success, message }) => {
        if (success) {
          Alert.alert("Success", "Images uploaded successfully!");
          router.replace("/dashboard");
        } else {
          Alert.alert("Error", message || "Failed to upload images.");
        }
      })
      .catch((error) => {
        // console.error("Upload Error:", error);
        Alert.alert("Error", error.message || "Something went wrong.");
      })
      .finally(() => setIsLoading(false));
  };

  // Remove selected image
  const removeImage = (uri: string) => {
    setImages((prevImages) => prevImages.filter((image) => image !== uri));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <CustomHeader />

      {/* Main Card */}
      <View className="bg-white mx-4 my-4 rounded-3xl shadow-md p-6">
        <View className="mx-4 my-4 rounded-3xl p-6">
          {/* Header */}
          <Text className="text-2xl font-bold text-center text-primary mb-6">
            Upload Event Images
          </Text>

          {/* Image Upload */}
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Select Photos
          </Text>
          <View className="flex-row gap-4 space-x-4 mb-4">
            {/* Select from Gallery */}
            <TouchableOpacity
              onPress={pickImages}
              className="flex-1 items-center justify-center bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
            >
              <Ionicons name="image" size={24} color="#f89f22" />
              <Text className="text-sm text-gray-600 mt-2">Select Photos</Text>
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
              images.length > 0 ? "bg-primary" : "bg-gray-300"
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
    </SafeAreaView>
  );
};

export default CreateScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../utils/api"; // Import API methods

const CreateScreen = () => {
  const [images, setImages] = useState<string[]>([]); // State to hold multiple images
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  // Handle Image Selection for multiple images
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      selectionLimit: 5, // Allow multiple images (5 in this case)
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  // Handle Taking a Picture
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert("Error", "Please upload at least one image.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();

    try {
      // Convert each image URI to a Blob object and append to formData
      for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i]);
        const blob = await response.blob(); // Convert URI to Blob
        const fileData = {
          uri: images[i],
          name: `photo_${Date.now()}_${i}.jpg`,
          type: "image/jpeg",
          size: blob.size,
        };
        formData.append("images", blob, fileData.name);
      }

      // Debugging - log the FormData to verify it is correctly populated
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await api.createOrderEntry(formData);

      if (response.success === true) {
        Alert.alert("Success", "Entry created successfully!");
        router.replace("/dashboard");
      } else {
        Alert.alert("Error", "Failed to create entry.");
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
    <SafeAreaView className="flex-1 bg-gray-100 px-6 pt-16">
      {/* Header */}
      <Text className="text-2xl font-bold text-center text-red-500 mb-6">
        Upload Event Images
      </Text>

      {/* Image Upload */}
      <Text className="text-sm font-medium text-gray-700 mb-2">Select Photos</Text>
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
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
    </SafeAreaView>
  );
};

export default CreateScreen;

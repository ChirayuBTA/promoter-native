import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../utils/api"; // Import API methods

const CreateScreen = () => {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  // Handle Image Selection / Capture
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      console.log("result.assets[0].uri",result.assets[0].uri)
      setImage(result.assets[0].uri);
    }
  };

  // Handle Taking a Picture
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!name || !phone || !image) {
      Alert.alert("Error", "Please fill all fields and upload an image.");
      return;
    }
  
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
  
    // Convert image URI to a Blob object using fetch
    const response = await fetch(image);
    const blob = await response.blob(); // Convert URI to Blob
  
    // Create the file-like object to append to FormData
    const fileData = {
      uri: image,
      name: `photo_${Date.now()}.jpg`,
      type: "image/jpeg", // The MIME type of the file
      size: blob.size, // Adding the size to ensure the backend can correctly interpret the file
    };
  
    formData.append("image", blob, fileData.name);
  
    // Debugging - log the FormData to verify it is correctly populated
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const response = await api.createOrderEntry(formData)
  
      
  
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
  
  
  

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-6 pt-16">
      {/* Header */}
      <Text className="text-2xl font-bold text-center text-red-500 mb-6">
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
      <Text className="text-sm font-medium text-gray-700 mb-2">Phone</Text>
      <TextInput
        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 mb-4 text-lg text-black"
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* Image Upload */}
      <Text className="text-sm font-medium text-gray-700 mb-2">Photo</Text>
      <View className="flex-row space-x-4 mb-4">
        {/* Select from Gallery */}
        <TouchableOpacity
          onPress={pickImage}
          className="flex-1 items-center justify-center bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
        >
          <Ionicons name="image" size={24} color="#E53E3E" />
          <Text className="text-sm text-gray-600 mt-2">Select Photo</Text>
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

      {/* Preview Image */}
      {image && (
        <View className="items-center mb-4">
          <Image
            source={{ uri: image }}
            className="w-32 h-32 rounded-xl border border-gray-300"
          />
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading}
        className={`w-full py-4 rounded-xl ${
          name && phone && image ? "bg-red-500" : "bg-gray-300"
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

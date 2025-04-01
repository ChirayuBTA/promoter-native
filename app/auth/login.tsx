import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/utils/api"; // Import the API

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Handle sending OTP
  const sendOTP = async () => {
    if (phoneNumber.length === 10) {
      setIsLoading(true);

      try {
        // Call the API to send OTP
        const response = await api.sendOTP({ phone: phoneNumber });
        console.log("response---");

        if (response.success) {
          // If successful, navigate to the OTP verification screen
          router.push({
            pathname: "/auth/otp",
            params: { phoneNumber },
          });
        } else {
          // If the response is not successful, show the error message
          Alert.alert("Error", response.message || "Failed to send OTP.");
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again.");
        console.error("Error sending OTP:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid 10-digit mobile number."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Content Section */}
        <View className="px-6 pt-14 flex-1 justify-center">
          <View className="rounded-b-[50px] justify-center items-center">
            <Image
              source={require("../../assets/images/DirectX-Logo.png")}
              className="w-40 h-40"
              resizeMode="contain"
            />
          </View>
          <Text className="text-2xl font-bold text-center mb-2 text-gray-800">
            Welcome Back!
          </Text>
          <Text className="text-center text-gray-500 mb-8">
            Log in with your registered mobile number
          </Text>

          {/* Phone Number Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-600 mb-2 ml-1">
              Mobile Number
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
              <View className="pr-3 border-r border-gray-300">
                <Text className="text-lg text-gray-700 font-medium">+91</Text>
              </View>
              <TextInput
                className="flex-1 text-lg text-black ml-3"
                keyboardType="numeric"
                placeholder="10-digit number"
                placeholderTextColor="#A0A0A0"
                maxLength={10}
                value={phoneNumber}
                onChangeText={
                  (text) => setPhoneNumber(text.replace(/[^0-9]/g, "")) // Ensure only numbers
                }
              />
              {phoneNumber.length > 0 && (
                <TouchableOpacity onPress={() => setPhoneNumber("")}>
                  <Ionicons name="close-circle" size={22} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 shadow-md ${
              phoneNumber.length === 10
                ? "bg-red-500 active:bg-red-600"
                : "bg-gray-300"
            }`}
            onPress={sendOTP}
            disabled={phoneNumber.length !== 10 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">
                Send OTP
              </Text>
            )}
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View className="flex-row justify-center mt-10 mb-6">
            <View className="flex-row items-center space-x-2">
              <View className="h-2 w-8 rounded-full bg-red-500" />
              <View className="h-2 w-8 rounded-full bg-gray-300" />
            </View>
          </View>
        </View>

        {/* Footer Section */}
        <View className="px-6 pb-8">
          {/* Terms & Policy */}
          <Text className="text-xs text-gray-500 text-center mb-6">
            By continuing, you agree to our{" "}
            <Text className="text-red-500 font-medium">Terms of Services</Text>{" "}
            & <Text className="text-red-500 font-medium">Privacy Policy</Text>
          </Text>

          {/* Support */}
          <TouchableOpacity
            className="flex-row justify-center items-center py-2"
            activeOpacity={0.7}
          >
            <Ionicons name="help-circle-outline" size={18} color="#6b7280" />
            <Text className="text-sm text-gray-500 ml-1">
              Need help?{" "}
              <Text className="text-red-500 font-medium">Contact Support</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

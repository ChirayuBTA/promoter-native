import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const OtpScreen = () => {
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const router = useRouter();

  // Countdown Timer for Resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle OTP verification
  const verifyOTP = async () => {
    if (otp.length === 6) {
      setIsLoading(true);
      try {
        // Simulating OTP verification API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // // Navigate to Dashboard or Home
        // router.replace("/dashboard");
      } catch (error) {
        Alert.alert("Error", "Failed to verify OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
    }
  };

  // Handle Resend OTP
  const resendOTP = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      Alert.alert("OTP Sent", "A new OTP has been sent to your number.");
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
          <View className="rounded-b-[50px] justify-center items-center mb-6">
            <Ionicons name="keypad" size={80} color="#f87171" />
          </View>

          <Text className="text-2xl font-bold text-center mb-2 text-gray-800">
            Enter OTP
          </Text>
          <Text className="text-center text-gray-500 mb-8">
            We've sent a 6-digit OTP to{" "}
            <Text className="text-black font-medium">+91 {phoneNumber}</Text>
          </Text>

          {/* OTP Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-600 mb-2 ml-1">
              OTP Code
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
              <TextInput
                className="flex-1 text-lg text-black tracking-widest text-center"
                keyboardType="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                placeholderTextColor="#A0A0A0"
                value={otp}
                onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
                autoFocus
              />
              {otp.length > 0 && (
                <TouchableOpacity onPress={() => setOtp("")}>
                  <Ionicons name="close-circle" size={22} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Verify OTP Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 shadow-md ${
              otp.length === 6 ? "bg-red-500 active:bg-red-600" : "bg-gray-300"
            }`}
            onPress={verifyOTP}
            disabled={otp.length !== 6 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">
                Verify OTP
              </Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP Button */}
          <View className="flex-row justify-center mt-6">
            {resendTimer === 0 ? (
              <TouchableOpacity onPress={resendOTP}>
                <Text className="text-red-500 font-medium text-sm">
                  Resend OTP
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-gray-500 text-sm">
                Resend OTP in{" "}
                <Text className="text-black font-medium">{resendTimer}s</Text>
              </Text>
            )}
          </View>

          {/* Progress Indicator */}
          <View className="flex-row justify-center mt-10 mb-6">
            <View className="flex-row items-center space-x-2">
              <View className="h-2 w-8 rounded-full bg-red-500" />
              <View className="h-2 w-8 rounded-full bg-red-500" />
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

export default OtpScreen;

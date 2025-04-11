import React, { useEffect, useState } from "react";
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
import { api } from "@/utils/api";
import { getAuthValue, getLocValue } from "@/utils/storage";

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Storage Data state
  const [token, setToken] = useState<string | null>(null);
  const [promoterId, setPromoterId] = useState<string | null>(null);
  const [activityLocId, setActivityLocId] = useState<string | null>(null);
  const [cityId, setCityId] = useState<string | null>(null);

  const router = useRouter();
  // Get stored values from authStorage
  const getStoredData = async () => {
    try {
      const storedToken = await getAuthValue("token");
      const storedPromoterId = await getAuthValue("promoterId");
      const storedCityId = await getAuthValue("cityId");
      const storedActivityLocId = await getLocValue("activityLocId");

      if (storedToken) setToken(storedToken);
      if (storedPromoterId) setPromoterId(storedPromoterId);
      if (storedActivityLocId) setActivityLocId(storedActivityLocId);
      if (storedCityId) setCityId(storedCityId);
    } catch (err) {
      // setError("Failed to fetch data from storage.");
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getStoredData(); // Get stored values on mount
  }, []);

  useEffect(() => {
    if (token && promoterId && !activityLocId) {
      router.replace("/location");
    } else if (token && promoterId && activityLocId) {
      router.replace("/dashboard");
    }
  }, [token, promoterId, activityLocId]);

  console.log("token", token);
  console.log("promoterId", promoterId);
  console.log("activityLocId", activityLocId);
  console.log("cityId", cityId);

  // Handle sending OTP
  const sendOTP = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    setIsLoading(true);

    api
      .sendOTP({ phone: phoneNumber })
      .then((response) => {
        if (response.success) {
          router.replace({
            pathname: "/auth/otp",
            params: { phoneNumber },
          });
        } else {
          Alert.alert("Error", response.message || "Failed to send OTP.");
        }
      })
      .catch((error) => {
        Alert.alert("Error", error.message || "Error sending OTP");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
            {/* <View className="flex-row">
              <Text
                className="text-[38px] font-[900] tracking-tighter"
                // style={{ fontSize: 40, fontWeight: "bold" }}
              >
                DIRECT
              </Text>
              <Text
                className="text-[38px] text-red-600 font-[900] tracking-tighter"
                // style={{ fontSize: 40, fontWeight: "bold", color: "red" }}
              >
                X
              </Text>
            </View> */}
            <Image
              source={require("@/assets/images/appLogo.png")}
              style={{ width: 120, height: 40, resizeMode: "contain" }}
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
                ? "bg-primary active:bg-primary"
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
              <View className="h-2 w-8 rounded-full bg-primary" />
              <View className="h-2 w-8 rounded-full bg-gray-300" />
            </View>
          </View>
        </View>

        {/* Footer Section */}
        <View className="px-6 pb-8">
          {/* Terms & Policy */}
          <Text className="text-xs text-gray-500 text-center mb-6">
            By continuing, you agree to our{" "}
            <Text className="text-primary font-medium">Terms of Services</Text>{" "}
            & <Text className="text-primary font-medium">Privacy Policy</Text>
          </Text>

          {/* Support */}
          <TouchableOpacity
            className="flex-row justify-center items-center py-2"
            activeOpacity={0.7}
          >
            <Ionicons name="help-circle-outline" size={18} color="#6b7280" />
            <Text className="text-sm text-gray-500 ml-1">
              Need help?{" "}
              <Text className="text-primary font-medium">Contact Support</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

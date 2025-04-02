import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { getAuthValue } from "../utils/authStorage"; // Import getAuthValue
import { api } from "../utils/api"; // Import API methods
import Header from "./header"; // Assuming Header is in components folder

const DashboardScreen = () => {
  const [activeTab, setActiveTab] = useState<"today" | "total">("today");
  const [todayEntries, setTodayEntries] = useState<any[]>([]);
  const [totalEntries, setTotalEntries] = useState<any[]>([]);
  const [societyName, setSocietyName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [societyId, setSocietyId] = useState<string | null>(null);
  const [promoterId, setPromoterId] = useState<string | null>(null);
  const router = useRouter();

  // Get status bar height
  const statusBarHeight =
    Platform.OS === "ios"
      ? Constants.statusBarHeight
      : StatusBar.currentHeight || 24;

  // Fetch dashboard data with query parameters
  const fetchData = async () => {
    if (!societyId || !promoterId) return; // Ensure values exist before API call

    setLoading(true);
    try {
      const data = await api.getDashboardData({
        societyId,
        promoterId,
      });
      setTodayEntries(data.todayEntries || []);
      setTotalEntries(data.totalEntries || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch society name


  // Get stored values from authStorage
  const getStoredData = async () => {
    try {
      const storedSocietyId = await getAuthValue("societyId");
      const storedPromoterId = await getAuthValue("promoterId");
      const storedSocietyName = await getAuthValue("societyName");

      if (storedSocietyId) setSocietyId(storedSocietyId);
      if (storedPromoterId) setPromoterId(storedPromoterId);
      if (storedSocietyName) setSocietyName(storedSocietyName);

    } catch (err) {
      setError("Failed to fetch data from storage.");
    }
  };

  useEffect(() => {
    getStoredData(); // Get stored values on mount
  }, []);



  useEffect(() => {
    fetchData();
  }, [societyId, promoterId,societyName]); // Trigger fetchData when values are set

  // Render Entry Item
  const renderEntryItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-200">
      <Text className="text-lg font-semibold text-gray-700">{item.name}</Text>
      <Text className="text-sm text-gray-500">
        Flat: {item.flat} | Time: {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#E53E3E" />
      <Header /> 
      {/* Spacer for StatusBar height */}
      <View style={{ height: statusBarHeight, backgroundColor: "#E53E3E" }} />

      {/* Header Section */}
      <View className="bg-red-500 py-6 px-6 rounded-b-2xl shadow-md">
        <Text className="text-2xl font-bold text-white">
          {societyName || "Loading..."}
        </Text>
      </View>

      {/* Today's Entry Count */}
      <View className="bg-white mx-6 mt-4 p-4 rounded-xl shadow-md border border-gray-200">
        <Text className="text-lg font-semibold text-gray-700 mb-1">
          Today's Entries
        </Text>
        <Text className="text-2xl font-bold text-red-500">
          {todayEntries.length}
        </Text>
      </View>

      {/* Tabs Section */}
      <View className="flex-row justify-around bg-white mx-6 mt-6 rounded-xl p-2 shadow-md border border-gray-200">
        <TouchableOpacity
          className={`flex-1 items-center py-3 rounded-xl ${
            activeTab === "today" ? "bg-red-500" : "bg-gray-100"
          }`}
          onPress={() => setActiveTab("today")}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === "today" ? "text-white" : "text-gray-500"
            }`}
          >
            Today's Entries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-3 rounded-xl ${
            activeTab === "total" ? "bg-red-500" : "bg-gray-100"
          }`}
          onPress={() => setActiveTab("total")}
        >
          <Text
            className={`text-sm font-medium ${
              activeTab === "total" ? "text-white" : "text-gray-500"
            }`}
          >
            Total Entries
          </Text>
        </TouchableOpacity>
      </View>

      {/* Entries List */}
      <View className="flex-1 mx-6 mt-4">
        {loading ? (
          <Text className="text-center text-gray-500 mt-4">Loading...</Text>
        ) : error ? (
          <Text className="text-center text-red-500 mt-4">{error}</Text>
        ) : (
          <FlatList
            data={activeTab === "today" ? todayEntries : totalEntries}
            renderItem={renderEntryItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <Text className="text-center text-gray-500 mt-4">
                No entries available
              </Text>
            )}
          />
        )}
      </View>

      {/* Floating + Button */}
      <TouchableOpacity
        onPress={() => router.push("/CreateScreen")}
        className="absolute bottom-8 right-8 bg-red-500 rounded-full p-4 shadow-md"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DashboardScreen;

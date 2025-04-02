import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { getAuthValue, getLocValue } from "../utils/storage";
import { api } from "../utils/api";
import { format } from "date-fns";
import CustomHeader from "@/components/CustomHeader";

const DashboardScreen = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [todayEntries, setTodayEntries] = useState([]);
  const [totalEntries, setTotalEntries] = useState([]);
  const [societyName, setSocietyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [societyId, setSocietyId] = useState(null);
  const [promoterId, setPromoterId] = useState(null);
  const router = useRouter();
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");

  // Get status bar height
  const statusBarHeight =
    Platform.OS === "ios"
      ? Constants.statusBarHeight
      : StatusBar.currentHeight || 24;

  // Fetch dashboard data with query parameters
  const fetchData = async () => {
    if (!societyId || !promoterId) return;

    setLoading(true);
    try {
      const response = await api.getDashboardData({
        activityLocId: societyId,
        promoterId,
      });

      setTodayEntries(response.data.todaysEntries || []);
      setTotalEntries(response.data.totalEntries || []);
      setError(null);
    } catch (err) {
      // setError("Failed to fetch dashboard data.");
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Get stored values from authStorage
  const getStoredData = async () => {
    try {
      const storedSocietyId = await getLocValue("societyId");
      const storedPromoterId = await getAuthValue("promoterId");
      const storedSocietyName = await getLocValue("societyName");

      if (storedSocietyId) setSocietyId(storedSocietyId);
      if (storedPromoterId) setPromoterId(storedPromoterId);
      if (storedSocietyName) setSocietyName(storedSocietyName);
    } catch (err) {
      // setError("Failed to fetch data from storage.");
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    getStoredData(); // Get stored values on mount
  }, []);

  useEffect(() => {
    fetchData();
  }, [societyId, promoterId, societyName]); // Trigger fetchData when values are set

  // Render Entry Item
  const renderEntryItem = ({ item }: any) => (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-200">
      <Text className="text-lg font-semibold text-gray-700">
        {item.orderId.startsWith("#") ? item.orderId : `#${item.orderId}`}
      </Text>
      <Text className="text-sm text-gray-500">
        Name: {item.customerName} | Phone: {item.customerPhone}
      </Text>
      <Text className="text-sm text-gray-500">
        Address: {item.orderAddress}
      </Text>
      <Text className="text-sm text-gray-500">Status: {item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-gray-100"
      style={{ paddingTop: statusBarHeight }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <CustomHeader />

      {/* Main Card */}
      <View className="bg-white mx-4 my-4 rounded-3xl shadow-md p-6">
        <View className="items-center mb-4">
          <Text className="text-3xl font-semibold text-gray-800">
            {societyName || "Acme Avenue"}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="calendar-outline" size={20} color="gray" />
            <Text className="text-gray-500 ml-2">{currentDate}</Text>
          </View>
        </View>

        {/* Today's Activity Records */}
        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={24} color="gray" />
            <View className="ml-2">
              <Text className="text-gray-500">Today's Activity</Text>
              <Text className="text-xl font-semibold text-gray-800">
                Records
              </Text>
            </View>
          </View>
          <View className="bg-red-600 h-16 w-16 rounded-lg items-center justify-center">
            <Text className="text-white text-3xl font-bold">
              {todayEntries.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs Section */}
      <View className="flex-row justify-between mx-4">
        <TouchableOpacity
          className={`flex-1 py-4 ${
            activeTab === "today" ? "border-b-2 border-red-600" : ""
          }`}
          onPress={() => setActiveTab("today")}
        >
          <Text
            className={`text-center text-lg ${
              activeTab === "today" ? "text-black font-medium" : "text-gray-500"
            }`}
          >
            Today's Entries ({todayEntries.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-4 ${
            activeTab === "total" ? "border-b-2 border-red-600" : ""
          }`}
          onPress={() => setActiveTab("total")}
        >
          <Text
            className={`text-center text-lg ${
              activeTab === "total" ? "text-black font-medium" : "text-gray-500"
            }`}
          >
            All Entries ({totalEntries.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Entries List */}
      <View className="flex-1 mx-4 mt-4">
        {loading ? (
          <Text className="text-center text-gray-500 mt-4">Loading...</Text>
        ) : error ? (
          <Text className="text-center text-red-500 mt-4">{error}</Text>
        ) : todayEntries.length === 0 && totalEntries.length === 0 ? (
          <Text className="text-center text-gray-500 text-lg mt-4">
            No data available.
          </Text>
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

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push("/CreateScreen")}
        className="absolute bottom-8 right-8 bg-red-500 rounded-full h-16 w-16 items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DashboardScreen;

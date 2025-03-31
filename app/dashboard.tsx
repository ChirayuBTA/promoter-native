import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  Platform,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

const DashboardScreen = () => {
  const [activeTab, setActiveTab] = useState<"today" | "total">("today");
  const router = useRouter();

  // Get status bar height
  const statusBarHeight =
    Platform.OS === "ios"
      ? Constants.statusBarHeight
      : StatusBar.currentHeight || 24;

  // Dummy Data for Entries
  const todayEntries = [
    { id: "1", name: "John Doe", flat: "A-101", time: "10:00 AM" },
    { id: "2", name: "Mary Smith", flat: "B-202", time: "12:30 PM" },
  ];

  const totalEntries = [
    ...todayEntries,
    { id: "3", name: "Alex Brown", flat: "C-303", time: "08:15 AM" },
  ];

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
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#E53E3E" />

      {/* This view acts as a spacer with the exact height of the status bar */}
      <View style={{ height: statusBarHeight, backgroundColor: "#E53E3E" }} />

      {/* Header Section with proper spacing */}
      <View className="bg-red-500 py-6 px-6 rounded-b-2xl shadow-md">
        <Text className="text-2xl font-bold text-white">
          Green Valley Society
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
      </View>

      {/* Floating + Button */}
      <TouchableOpacity
        onPress={() => router.push("/create")}
        className="absolute bottom-8 right-8 bg-red-500 rounded-full p-4 shadow-md"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;

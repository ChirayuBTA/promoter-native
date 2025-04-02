import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";

// Custom Header Component
const CustomHeader = ({ isLocationScreen }: { isLocationScreen?: boolean }) => {
  const router = useRouter();

  const handleMenuPress = () => {
    console.log("Menu pressed");
    // Add your menu logic here
  };

  return (
    <View className="flex-row justify-between items-center px-6 py-4 bg-white">
      <View className="flex-row items-center">
        <Text className="text-3xl font-bold">DIRECT</Text>
        <Text className="text-3xl font-bold text-red-600">X</Text>
      </View>
      {isLocationScreen ? (
        <View className="flex-row">
          <TouchableOpacity className="p-2">
            <LogOut size={22} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row">
          <TouchableOpacity className="mr-4" onPress={() => router.push("/")}>
            <Ionicons name="home-outline" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMenuPress}>
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CustomHeader;

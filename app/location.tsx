import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import {
  ArrowRightCircle,
  LogOut,
  Search,
  MapPin,
  Building,
  ChevronRight,
} from "lucide-react-native";
import { api } from "@/utils/api";
import { getAuthValue, storeAuthData, storeLocData } from "@/utils/authStorage";
import { useRouter } from "expo-router";
import CustomHeader from "@/components/CustomHeader";

// Define types for our data structures
interface City {
  id: string;
  name: string;
}

interface Society {
  id: string;
  name: string;
  status: string;
  activity: {
    id: string;
    name: string;
  };
}

interface SelectItem {
  key: string;
  value: string;
}

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
}

interface LocationScreenProps {
  navigation: NavigationProps;
}

export default function LocationScreen({ navigation }: LocationScreenProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSociety, setSelectedSociety] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );
  const [cities, setCities] = useState<SelectItem[]>([]);
  const [societies, setSocieties] = useState<SelectItem[]>([]);
  const [societiesData, setSocietiesData] = useState<Society[]>([]); // Store full society objects
  const [loadingCities, setLoadingCities] = useState<boolean>(true);
  const [loadingSocieties, setLoadingSocieties] = useState<boolean>(false);
  const [citySearch, setCitySearch] = useState<string>("");
  const [societySearch, setSocietySearch] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [selectedSocietyName, setSelectedSocietyName] = useState<string>("");
  const router = useRouter();

  const fetchCities = async () => {
    setLoadingCities(true);
    try {
      const response = await api.getCities({
        limit: 20,
        page: 1,
        search: citySearch,
      });

      setCities(
        response?.data?.map((city: City) => ({
          key: city.id,
          value: city.name,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching cities:", error);
      Alert.alert("Error", "Failed to load cities. Please try again.");
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchSocieties = async (cityId: string) => {
    setLoadingSocieties(true);
    try {
      const response = await api.getSocities({
        limit: 20,
        page: 1,
        search: societySearch,
        cityId,
      });
      console.log("response---", response);

      // Store the full society objects with activity data
      setSocietiesData(response?.data || []);

      // Create the dropdown items
      setSocieties(
        response?.data?.map((soc: Society) => ({
          key: soc.id,
          value: soc.name,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching societies:", error);
      Alert.alert("Error", "Failed to load societies. Please try again.");
    } finally {
      setLoadingSocieties(false);
    }
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
    const selectedCityObj = cities.find((city) => city.key === cityId);
    setSelectedCityName(selectedCityObj?.value || "");
    setSelectedSociety(null);
    setSelectedActivityId(null);
    setSelectedSocietyName("");
  };

  const handleSocietySelect = (societyId: string) => {
    setSelectedSociety(societyId);

    // Find the selected society from the full dataset
    const selectedSocietyObj = societiesData.find(
      (society) => society.id === societyId
    );

    // Set society name
    setSelectedSocietyName(selectedSocietyObj?.name || "");

    // Store the activity ID if available
    if (selectedSocietyObj?.activity?.id) {
      setSelectedActivityId(selectedSocietyObj.activity.id);
      console.log("Selected activity ID:", selectedSocietyObj.activity.id);
    }
  };

  const handleContinue = async () => {
    console.log("COntinew", selectedCity, selectedSociety);
    if (selectedCity && selectedSociety) {
      Alert.alert(
        "Confirm Selection",
        `You've selected ${selectedSocietyName} in ${selectedCityName}. This cannot be changed later.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: async () => {
              // Store the selected society and activity IDs
              const locationData = {
                cityId: selectedCity,
                cityName: selectedCityName,
                societyId: selectedSociety,
                societyName: selectedSocietyName,
                activityId: selectedActivityId,
              };

              // Store the data using the provided function
              const stored = await storeLocData(locationData);
              if (stored) {
                console.log("Location data stored successfully:", locationData);
                // Navigate to next screen
                router.push("/dashboard");
                // navigation.navigate("/dashboard");
              } else {
                Alert.alert(
                  "Error",
                  "Failed to save your selection. Please try again."
                );
              }
            },
          },
        ]
      );
    } else {
      // This is a fallback in case something is missing
      Alert.alert(
        "Error",
        "Please select both city and society before continuing."
      );
    }
  };

  useEffect(() => {
    fetchCities();
  }, [citySearch]);

  useEffect(() => {
    if (selectedCity) {
      fetchSocieties(selectedCity);
    }
  }, [selectedCity, societySearch]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      {/* <View className="flex-row justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200">
        <View className="flex-row items-center">
          <Text className="text-2xl font-bold">
            DIRECT<Text className="text-red-500">X</Text>
          </Text>
        </View>
        <TouchableOpacity className="p-2">
          <LogOut size={22} color="#374151" />
        </TouchableOpacity>
      </View> */}

      <CustomHeader isLocationScreen={true} />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Title Section */}
        <View className="mb-6 mt-2">
          <Text className="text-2xl font-bold text-gray-800 text-center">
            Select Your Location
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Please select your city and society below
          </Text>
          <View className="flex-row justify-center mt-2">
            <View className="bg-red-50 px-3 py-1 rounded-full">
              <Text className="text-red-500 text-xs font-medium">
                Note: Selection cannot be changed later
              </Text>
            </View>
          </View>
        </View>

        {/* Selection Cards */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <View className="flex-row items-center mb-2">
            <MapPin size={18} color="#EF4444" />
            <Text className="text-gray-800 font-semibold text-lg ml-2">
              City
            </Text>
          </View>

          {loadingCities ? (
            <View className="h-12 justify-center items-center">
              <ActivityIndicator size="small" color="#EF4444" />
            </View>
          ) : (
            <View className="border border-gray-200 rounded-lg bg-gray-50">
              <SelectList
                setSelected={(val: string) => handleCitySelect(val)}
                data={cities}
                save="key"
                placeholder="Search for your city..."
                boxStyles={{
                  borderWidth: 0,
                  backgroundColor: "transparent",
                  height: 50,
                }}
                inputStyles={{
                  fontSize: 16,
                  color: "#1F2937",
                }}
                dropdownStyles={{
                  borderColor: "#E5E7EB",
                  backgroundColor: "white",
                  maxHeight: 200,
                }}
                dropdownItemStyles={{
                  paddingVertical: 12,
                }}
                dropdownTextStyles={{
                  fontSize: 16,
                }}
                search={true}
                searchPlaceholder="Type to search cities..."
                onSelect={() => {
                  // We'll use setSelected for the actual value setting
                  // This is just for any additional actions on selection
                }}
              />
            </View>
          )}
        </View>

        {selectedCity && (
          <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Building size={18} color="#EF4444" />
              <Text className="text-gray-800 font-semibold text-lg ml-2">
                Society
              </Text>
            </View>

            {loadingSocieties ? (
              <View className="h-12 justify-center items-center">
                <ActivityIndicator size="small" color="#EF4444" />
              </View>
            ) : (
              <View className="border border-gray-200 rounded-lg bg-gray-50">
                <SelectList
                  setSelected={(val: string) => handleSocietySelect(val)}
                  data={societies}
                  save="key"
                  placeholder="Search for your society..."
                  boxStyles={{
                    borderWidth: 0,
                    backgroundColor: "transparent",
                    height: 50,
                  }}
                  inputStyles={{
                    fontSize: 16,
                    color: "#1F2937",
                  }}
                  dropdownStyles={{
                    borderColor: "#E5E7EB",
                    backgroundColor: "white",
                    maxHeight: 200,
                  }}
                  dropdownItemStyles={{
                    paddingVertical: 12,
                  }}
                  dropdownTextStyles={{
                    fontSize: 16,
                  }}
                  search={true}
                  searchPlaceholder="Type to search societies..."
                  disabled={!selectedCity}
                />
              </View>
            )}
          </View>
        )}

        {/* Selected Location Summary */}
        {(selectedCityName || selectedSocietyName) && (
          <View className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
            <Text className="text-gray-700 font-medium mb-2">
              Your Selection:
            </Text>
            {selectedCityName && (
              <View className="flex-row items-center mb-1">
                <MapPin size={14} color="#4B5563" />
                <Text className="text-gray-700 ml-2">{selectedCityName}</Text>
              </View>
            )}
            {selectedSocietyName && (
              <View className="flex-row items-center">
                <Building size={14} color="#4B5563" />
                <Text className="text-gray-700 ml-2">
                  {selectedSocietyName}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer Action Button */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <TouchableOpacity
          onPress={handleContinue}
          className={`flex-row justify-center items-center p-4 rounded-lg ${
            selectedCity && selectedSociety ? "bg-red-500" : "bg-gray-300"
          }`}
          disabled={!selectedCity || !selectedSociety}
        >
          <Text className="text-white font-semibold text-lg mr-2">
            Confirm Selection
          </Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

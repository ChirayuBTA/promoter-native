import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SearchDropdown = ({
  placeholder = "Search...",
  fetchData,
  onValueChange,
}: {
  placeholder?: string;
  fetchData: (query: string) => Promise<any[]>;
  onValueChange: (value: string) => void;
}) => {
  const [items, setItems] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [filteredValues, setFilteredValues] = useState<string[]>([]);
  const [openDropDown, setOpenDropDown] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleFocus = async () => {
    try {
      const data = await fetchData("");
      const itemsList = data.map((item) => item.name);
      setItems(itemsList);
      setFilteredValues(itemsList);
      setOpenDropDown(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeText = async (input: string) => {
    setText(input);
    onValueChange(input);

    try {
      const data = await fetchData(input);
      const itemsList = data;
      setItems(itemsList);
      setFilteredValues(itemsList);
      setOpenDropDown(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelectValue = (selectedValue: string) => {
    setText(selectedValue);
    onValueChange(selectedValue);
    setFilteredValues([]);
    setItems([]);
    setOpenDropDown(false);
    inputRef.current?.clear();
  };

  useEffect(() => {
    if (text === "") {
      setOpenDropDown(false);
    }
  }, [text]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{placeholder}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={text}
        />
        <Image
          style={styles.icon}
          source={{ uri: "https://example.com/path/to/your/image.png" }}
        />
      </View>
      {openDropDown && (
        <View style={styles.dropdownWrapper}>
          <ScrollView
            style={styles.dropdownContainer}
            nestedScrollEnabled={true}
          >
            {filteredValues.map((value: any, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectValue(value)}
                style={styles.dropdownItem}
              >
                <Text style={styles.itemText}>{value.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
    marginVertical: 8,
  },
  label: {
    fontWeight: "400",
    fontSize: 14,
    color: "#FFF",
  },
  icon: {
    position: "absolute",
    right: 20,
    top: "50%",
    tintColor: "#888",
  },
  inputContainer: {
    position: "relative",
    width: 328,
  },
  input: {
    backgroundColor: "#f0f0f0",
    color: "#000",
    borderRadius: 12,
    marginTop: 8,
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    width: 328,
  },
  dropdownWrapper: {
    maxHeight: 200,
    width: 328,
    alignSelf: "center",
  },
  dropdownContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    color: "#666",
  },
});

export default SearchDropdown;

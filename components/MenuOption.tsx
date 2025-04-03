import React, { ReactNode } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface MenuOptionProps {
  onSelect: () => void;
  onClose?: () => void;
  children: ReactNode;
}

export const MenuOption: React.FC<MenuOptionProps> = ({
  onSelect,
  onClose,
  children,
}) => {
  const handlePress = () => {
    onSelect();
    if (onClose) {
      onClose();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.menuOption}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuOption: {
    padding: 10,
  },
});

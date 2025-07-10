import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, typography } from "../theme";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  primary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export default function CustomButton({
  title,
  onPress,
  icon,
  primary = false,
  disabled = false,
  loading = false,
  style,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={primary ? "white" : colors.primary.main}
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && (
            <Ionicons
              name={icon as any}
              size={20}
              color={primary ? "white" : colors.primary.main}
              style={styles.buttonIcon}
            />
          )}
        </View>
      )}
      {title.length > 0 && (
        <Text
          style={[
            styles.buttonText,
            primary ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    textAlign: "center",
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: colors.primary.main,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
    borderWidth: 1,
  },
  secondaryButton: {
    backgroundColor: colors.background.paper,
    borderColor: colors.primary.main,
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

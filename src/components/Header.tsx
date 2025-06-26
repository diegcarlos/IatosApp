import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { colors, shadows, typography } from "../theme";

interface HeaderProps {
  title: string;
  showLogo?: boolean;
  showBack?: boolean;
}

export default function Header({
  title,
  showLogo = true,
  showBack = true,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.primary.main}
            />
          </TouchableOpacity>
        )}
        
        {showLogo && (
          <View style={styles.logoContainer}>
            <Ionicons 
              name="medical" 
              size={22} 
              color={colors.primary.main} 
              style={styles.logoIcon}
            />
            <Text style={styles.logoText}>
              Sanabria
            </Text>
          </View>
        )}
        
        <Text style={styles.titleText}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.background.default,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    ...shadows.md,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  logoIcon: {
    marginRight: 4,
  },
  logoText: {
    color: colors.primary.main,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
  titleText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    flex: 1,
  },
});

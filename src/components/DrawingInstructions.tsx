import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";

interface DrawingInstructionsProps {
  hasSelection: boolean;
}

export default function DrawingInstructions({
  hasSelection,
}: DrawingInstructionsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={hasSelection ? "checkmark-circle" : "hand-left"}
          size={24}
          color={hasSelection ? colors.status.success : colors.primary.main}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {hasSelection ? "Área Selecionada!" : "Desenhe a Área"}
        </Text>
        <Text style={styles.description}>
          {hasSelection
            ? "Agora você pode enviar para a IA processar"
            : "Toque e arraste para desenhar a área onde deseja o transplante"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});

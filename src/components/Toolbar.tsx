import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme";
import CustomButton from "./CustomButton";

interface ToolbarProps {
  onClearDrawing: () => void;
  onCaptureAgain: () => void;
  onSendToAI: () => void;
  hasSelection: boolean;
  isLoading: boolean;
  showMask?: boolean;
  onToggleMask?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onClearDrawing,
  onCaptureAgain,
  onSendToAI,
  hasSelection,
  isLoading,
  showMask = false,
  onToggleMask,
}) => {
  return (
    <View style={styles.container}>
      {/* Botões de ação */}
      <View style={styles.actionButtons}>
        <CustomButton
          title="Voltar"
          onPress={onCaptureAgain}
          icon="arrow-back"
          disabled={isLoading}
        />

        {hasSelection && (
          <CustomButton
            title="Limpar"
            onPress={onClearDrawing}
            icon="trash"
            disabled={isLoading}
          />
        )}

        {hasSelection && (
          <CustomButton
            title="Simular"
            onPress={onSendToAI}
            icon="send"
            primary={true}
            disabled={isLoading}
            loading={isLoading}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.background.dark,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
  },
  secondaryButton: {
    backgroundColor: colors.text.secondary,
    borderColor: colors.text.secondary,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  dangerButton: {
    backgroundColor: colors.status.error,
    borderColor: colors.status.error,
  },
});

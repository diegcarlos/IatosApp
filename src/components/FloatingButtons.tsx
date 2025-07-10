import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface FloatingButtonsProps {
  hasSelection: boolean;
  onClearDrawing: () => void;
  onSimulate: () => void;
  onCaptureAgain: () => void;
  isLoading: boolean;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  hasSelection,
  onClearDrawing,
  onSimulate,
  onCaptureAgain,
  isLoading,
}) => {
  return (
    <>
      {/* Botão de Limpar - Flutuante no canto superior direito */}
      {hasSelection && (
        <TouchableOpacity
          style={[styles.floatingButton, styles.clearButton]}
          onPress={onClearDrawing}
          disabled={isLoading}
        >
          <Ionicons name="trash" size={20} color="white" />
        </TouchableOpacity>
      )}

      {/* Botão de Enviar - Flutuante no canto inferior direito */}
      {hasSelection && (
        <TouchableOpacity
          style={[styles.floatingButton, styles.sendButton]}
          onPress={onSimulate}
          disabled={isLoading}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      )}

      {/* Botão de Capturar Novamente - Flutuante no canto inferior esquerdo */}
      <TouchableOpacity
        style={[styles.floatingButton, styles.captureButton]}
        onPress={onCaptureAgain}
        disabled={isLoading}
      >
        <Ionicons name="arrow-back" size={20} color="white" />
      </TouchableOpacity>

      {/* Indicador de carregamento */}
      {isLoading && (
        <View style={[styles.floatingButton, styles.loadingButton]}>
          <Ionicons name="hourglass" size={20} color="white" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  clearButton: {
    top: 100,
    right: 20,
    backgroundColor: "#dc3545",
  },
  sendButton: {
    bottom: 100,
    right: 20,
    backgroundColor: "#007AFF",
  },
  captureButton: {
    bottom: 100,
    left: 20,
    backgroundColor: "#6c757d",
  },
  loadingButton: {
    bottom: 100,
    right: 20,
    backgroundColor: "#6c757d",
  },
});

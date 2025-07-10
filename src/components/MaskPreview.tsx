import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Point {
  x: number;
  y: number;
}

interface MaskPreviewProps {
  originalImageUri: string;
  maskUri: string | null;
  points: Point[];
  brushSize: number;
  imageWidth: number;
  imageHeight: number;
  onRegenerate?: () => void;
  onClear?: () => void;
}

export const MaskPreview: React.FC<MaskPreviewProps> = ({
  originalImageUri,
  maskUri,
  points,
  brushSize,
  imageWidth,
  imageHeight,
  onRegenerate,
  onClear,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [maskOpacity, setMaskOpacity] = useState(0.5);

  const handleShare = async () => {
    if (!maskUri) {
      Alert.alert("Erro", "Nenhuma máscara disponível para compartilhar");
      return;
    }

    Alert.alert(
      "Info",
      "Funcionalidade de compartilhamento será implementada em breve"
    );
  };

  const handleSave = async () => {
    if (!maskUri) {
      Alert.alert("Erro", "Nenhuma máscara disponível para salvar");
      return;
    }

    try {
      setIsLoading(true);

      const fileName = `mask_${Date.now()}.png`;
      const destinationUri = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({
        from: maskUri,
        to: destinationUri,
      });

      Alert.alert("Sucesso", `Máscara salva como ${fileName}`);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao salvar a máscara");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  const adjustOpacity = (increment: boolean) => {
    const newOpacity = increment
      ? Math.min(1, maskOpacity + 0.1)
      : Math.max(0, maskOpacity - 0.1);
    setMaskOpacity(newOpacity);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Preview da Máscara</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>Pontos: {points.length}</Text>
          <Text style={styles.statText}>Pincel: {brushSize}px</Text>
        </View>
      </View>

      <View style={styles.previewContainer}>
        {originalImageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: originalImageUri }}
              style={[styles.image, { width: imageWidth, height: imageHeight }]}
              resizeMode="contain"
            />

            {maskUri && showOverlay && (
              <Image
                source={{ uri: maskUri }}
                style={[
                  styles.maskOverlay,
                  {
                    width: imageWidth,
                    height: imageHeight,
                    opacity: maskOpacity,
                  },
                ]}
                resizeMode="contain"
              />
            )}
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={toggleOverlay}
          >
            <Ionicons
              name={showOverlay ? "eye-off" : "eye"}
              size={20}
              color="white"
            />
            <Text style={styles.buttonText}>
              {showOverlay ? "Ocultar" : "Mostrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={() => adjustOpacity(false)}
            disabled={maskOpacity <= 0}
          >
            <Ionicons name="remove" size={20} color="#007AFF" />
          </TouchableOpacity>

          <Text style={styles.opacityText}>
            {Math.round(maskOpacity * 100)}%
          </Text>

          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={() => adjustOpacity(true)}
            disabled={maskOpacity >= 1}
          >
            <Ionicons name="add" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionRow}>
          {onRegenerate && (
            <TouchableOpacity
              style={[styles.actionButton, styles.regenerateButton]}
              onPress={onRegenerate}
              disabled={isLoading}
            >
              <Ionicons name="refresh" size={18} color="white" />
              <Text style={styles.buttonText}>Regenerar</Text>
            </TouchableOpacity>
          )}

          {onClear && (
            <TouchableOpacity
              style={[styles.actionButton, styles.clearButton]}
              onPress={onClear}
              disabled={isLoading}
            >
              <Ionicons name="trash" size={18} color="white" />
              <Text style={styles.buttonText}>Limpar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isLoading || !maskUri}
          >
            <Ionicons name="save" size={18} color="white" />
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
            disabled={isLoading || !maskUri}
          >
            <Ionicons name="share" size={18} color="white" />
            <Text style={styles.buttonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  stats: {
    alignItems: "flex-end",
  },
  statText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  previewContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    borderRadius: 4,
  },
  maskOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 4,
  },
  controls: {
    gap: 12,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#f0f0f0",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  opacityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    minWidth: 40,
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  regenerateButton: {
    backgroundColor: "#28a745",
  },
  clearButton: {
    backgroundColor: "#dc3545",
  },
  saveButton: {
    backgroundColor: "#17a2b8",
  },
  shareButton: {
    backgroundColor: "#6f42c1",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  loadingText: {
    color: "white",
    marginTop: 8,
    fontSize: 16,
  },
});

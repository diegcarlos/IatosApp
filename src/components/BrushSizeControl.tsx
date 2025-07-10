import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BrushSizeControlProps {
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  minSize?: number;
  maxSize?: number;
  step?: number;
}

export const BrushSizeControl: React.FC<BrushSizeControlProps> = ({
  brushSize,
  onBrushSizeChange,
  minSize = 5,
  maxSize = 50,
  step = 5,
}) => {
  const decreaseBrushSize = () => {
    const newSize = Math.max(minSize, brushSize - step);
    onBrushSizeChange(newSize);
  };

  const increaseBrushSize = () => {
    const newSize = Math.min(maxSize, brushSize + step);
    onBrushSizeChange(newSize);
  };

  const getBrushPreviewSize = () => {
    // Normalizar o tamanho para preview visual
    const normalizedSize = (brushSize - minSize) / (maxSize - minSize);
    return Math.max(8, Math.min(32, 8 + normalizedSize * 24));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="brush" size={20} color="#007AFF" />
        <Text style={styles.title}>Tamanho do Pincel</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.decreaseButton]}
          onPress={decreaseBrushSize}
          disabled={brushSize <= minSize}
        >
          <Ionicons
            name="remove"
            size={20}
            color={brushSize <= minSize ? "#ccc" : "#007AFF"}
          />
        </TouchableOpacity>

        <View style={styles.previewContainer}>
          <View style={styles.preview}>
            <View
              style={[
                styles.brushPreview,
                {
                  width: getBrushPreviewSize(),
                  height: getBrushPreviewSize(),
                  borderRadius: getBrushPreviewSize() / 2,
                },
              ]}
            />
          </View>
          <Text style={styles.sizeText}>{brushSize}px</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.increaseButton]}
          onPress={increaseBrushSize}
          disabled={brushSize >= maxSize}
        >
          <Ionicons
            name="add"
            size={20}
            color={brushSize >= maxSize ? "#ccc" : "#007AFF"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View
            style={[
              styles.sliderFill,
              {
                width: `${
                  ((brushSize - minSize) / (maxSize - minSize)) * 100
                }%`,
              },
            ]}
          />
          <View
            style={[
              styles.sliderThumb,
              {
                left: `${((brushSize - minSize) / (maxSize - minSize)) * 100}%`,
                transform: [{ translateX: -8 }],
              },
            ]}
          />
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>{minSize}px</Text>
          <Text style={styles.sliderLabel}>{maxSize}px</Text>
        </View>
      </View>
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
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  decreaseButton: {
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  increaseButton: {
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  previewContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 16,
  },
  preview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  brushPreview: {
    backgroundColor: "#007AFF",
    opacity: 0.8,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  sliderContainer: {
    marginTop: 8,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    position: "relative",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  sliderThumb: {
    position: "absolute",
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#666",
  },
});

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
    <View className="bg-white rounded-xl p-4 my-2">
      <View className="flex-row items-center mb-4 gap-2">
        <Ionicons name="brush" size={20} color="#007AFF" />
        <Text className="text-base font-semibold text-[#1a1a1a]">
          Tamanho do Pincel
        </Text>
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          className="w-11 h-11 rounded-full items-center justify-center bg-white border-2 border-[#e0e0e0] shadow"
          onPress={decreaseBrushSize}
          disabled={brushSize <= minSize}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons
            name="remove"
            size={20}
            color={brushSize <= minSize ? "#ccc" : "#007AFF"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center mx-4">
          <View
            className="w-15 h-15 rounded-full bg-white items-center justify-center mb-2 shadow"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View
              style={{
                backgroundColor: "#007AFF",
                opacity: 0.8,
                width: getBrushPreviewSize(),
                height: getBrushPreviewSize(),
                borderRadius: getBrushPreviewSize() / 2,
              }}
            />
          </View>
          <Text className="text-sm font-semibold text-[#1a1a1a]">
            {brushSize}px
          </Text>
        </View>

        <TouchableOpacity
          className="w-11 h-11 rounded-full items-center justify-center bg-white border-2 border-[#e0e0e0] shadow"
          onPress={increaseBrushSize}
          disabled={brushSize >= maxSize}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons
            name="add"
            size={20}
            color={brushSize >= maxSize ? "#ccc" : "#007AFF"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

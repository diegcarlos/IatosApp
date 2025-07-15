import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AgeType, VolumeType } from "../types";

interface AgeVolumeSelectorProps {
  selectedAge: AgeType;
  selectedVolume: VolumeType;
  onAgeChange: (age: AgeType) => void;
  onVolumeChange: (volume: VolumeType) => void;
}

const ageOptions = [
  { value: "elderly" as AgeType, label: "Idoso" },
  { value: "middle-aged" as AgeType, label: "Meia-idade" },
  { value: "young" as AgeType, label: "Jovem" },
];

const volumeOptions = [
  { value: "more volume" as VolumeType, label: "Mais Volume" },
  { value: "less volume" as VolumeType, label: "Menos Volume" },
  { value: "natural" as VolumeType, label: "Natural" },
];

export default function AgeVolumeSelector({
  selectedAge,
  selectedVolume,
  onAgeChange,
  onVolumeChange,
}: AgeVolumeSelectorProps) {
  return (
    <View className="space-y-3">
      {/* Seletor de Idade */}
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Idade</Text>
        <View className="flex-row space-x-2">
          {ageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`flex-1 py-2 px-3 rounded-lg border ${
                selectedAge === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
              onPress={() => onAgeChange(option.value)}
            >
              <View className="flex-row items-center justify-center">
                <View
                  className={`w-3 h-3 rounded-full border mr-2 ${
                    selectedAge === option.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAge === option.value && (
                    <View className="w-1.5 h-1.5 rounded-full bg-white m-0.5" />
                  )}
                </View>
                <Text
                  className={`text-xs font-medium ${
                    selectedAge === option.value
                      ? "text-blue-700"
                      : "text-gray-600"
                  }`}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Seletor de Volume */}
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Volume</Text>
        <View className="flex-row space-x-2">
          {volumeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`flex-1 py-2 px-3 rounded-lg border ${
                selectedVolume === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
              onPress={() => onVolumeChange(option.value)}
            >
              <View className="flex-row items-center justify-center">
                <View
                  className={`w-3 h-3 rounded-full border mr-2 ${
                    selectedVolume === option.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedVolume === option.value && (
                    <View className="w-1.5 h-1.5 rounded-full bg-white m-0.5" />
                  )}
                </View>
                <Text
                  className={`text-xs font-medium ${
                    selectedVolume === option.value
                      ? "text-blue-700"
                      : "text-gray-600"
                  }`}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

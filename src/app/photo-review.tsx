import BflIa from "@/components/bfl-ia";
import StabilityIa from "@/components/stability-ia";
import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";

export default function PhotoReview() {
  const [selectedAI, setSelectedAI] = useState<"bfl" | "stability">("bfl");

  return (
    <SafeAreaView className="flex-1 bg-background-default">
      <Header title="Revisar Foto" showLogo={true} />

      <View className="flex-1">
        <View className="px-4 py-4 bg-white border-b border-gray-200">
          <View className="flex-row space-x-3 gap-2">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                selectedAI === "bfl"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              onPress={() => setSelectedAI("bfl")}
            >
              <View className="flex-row items-center justify-center">
                <View
                  className={`w-4 h-4 rounded-full border-2 mr-2 ${
                    selectedAI === "bfl"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAI === "bfl" && (
                    <View className="w-2 h-2 rounded-full bg-white m-0.5" />
                  )}
                </View>
                <Text className="text-sm font-medium text-gray-800">
                  BFL IA
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                selectedAI === "stability"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              onPress={() => setSelectedAI("stability")}
            >
              <View className="flex-row items-center justify-center">
                <View
                  className={`w-4 h-4 rounded-full border-2 mr-2 ${
                    selectedAI === "stability"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAI === "stability" && (
                    <View className="w-2 h-2 rounded-full bg-white m-0.5" />
                  )}
                </View>
                <Text className="text-sm font-medium text-gray-800">
                  Stability AI
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 px-4 py-6">
          {/* Aqui você pode renderizar diferentes componentes baseado no tipo de IA selecionado */}
          {selectedAI === "bfl" && <BflIa />}

          {selectedAI === "stability" && <StabilityIa />}
        </View>
      </View>
    </SafeAreaView>
  );
}

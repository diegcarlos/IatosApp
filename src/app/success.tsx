import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";

export default function Success() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <Header title="Enviado com Sucesso" showLogo={false} />
      <View className="flex-1 items-center justify-center p-5">
        <View className="mb-5">
          <Ionicons name="checkmark-circle-outline" size={100} color="green" />
        </View>
        <Text className="text-2xl font-bold mb-2 text-gray-800">Sucesso!</Text>
        <Text className="text-base text-center mb-8 text-gray-600 leading-6">
          Seu antes e depois foram enviados com sucesso para a clínica. Em breve
          você receberá mais informações pelo WhatsApp.
        </Text>
      </View>
      <View className="p-5 border-t border-gray-200">
        <CustomButton
          title="Voltar para o Início"
          onPress={() => router.push("/")}
          icon="home-outline"
          primary={true}
        />
      </View>
    </View>
  );
}

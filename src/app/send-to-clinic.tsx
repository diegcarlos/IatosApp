import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import { sendToClinic } from "../services/api";

export default function SendToClinic() {
  const router = useRouter();
  const { simulationResult } = useLocalSearchParams<{
    simulationResult: string;
  }>();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!name.trim()) {
      Alert.alert("Campo obrigatório", "Por favor, informe seu nome.");
      return;
    }

    if (!whatsapp.trim()) {
      Alert.alert(
        "Campo obrigatório",
        "Por favor, informe seu número de WhatsApp."
      );
      return;
    }

    // Validação simples de formato de WhatsApp
    const whatsappRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    if (!whatsappRegex.test(whatsapp)) {
      Alert.alert(
        "Formato inválido",
        "Por favor, informe o WhatsApp no formato (XX) XXXXX-XXXX"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Call the simulated API function
      await sendToClinic({
        name,
        whatsapp,
        simulationResult: JSON.parse(simulationResult),
      });

      // Navigate to Success screen on successful API call
      router.push("/success");
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      Alert.alert(
        "Erro",
        "Não foi possível enviar os dados para a clínica. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="Enviar para Clínica" showLogo={false} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-base text-center mb-5 text-gray-600">
          Preencha seus dados para receber mais informações da clínica.
        </Text>

        <View className="w-full">
          <Text className="text-base mb-1 text-gray-800">Nome:</Text>
          <TextInput
            className="border border-gray-300 rounded p-3 mb-5 text-base bg-white"
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome completo"
            autoCapitalize="words"
            editable={!isLoading} // Disable input while loading
          />

          <Text className="text-base mb-1 text-gray-800">WhatsApp:</Text>
          <TextInput
            className="border border-gray-300 rounded p-3 mb-5 text-base bg-white"
            value={whatsapp}
            onChangeText={setWhatsapp}
            placeholder="(XX) XXXXX-XXXX"
            keyboardType="phone-pad"
            editable={!isLoading} // Disable input while loading
          />
        </View>
      </ScrollView>

      <View className="p-5 border-t border-gray-200">
        {isLoading ? (
          <ActivityIndicator size="large" color="#2196F3" className="my-4" />
        ) : (
          <CustomButton
            title="Enviar"
            onPress={handleSend}
            icon="send-outline"
            primary={true}
          />
        )}
        <CustomButton
          title="Voltar"
          onPress={() => router.back()}
          icon="arrow-back-outline"
          primary={false}
          disabled={isLoading}
          style={isLoading ? "opacity-50" : ""} // Apply opacity when disabled
        />
      </View>
    </View>
  );
}

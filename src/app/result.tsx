import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import PhotoCard from "../components/PhotoCard";

export default function Result() {
  const router = useRouter();
  const { beforeAfterImages } = useLocalSearchParams<{
    beforeAfterImages: string;
  }>();
  const images = JSON.parse(beforeAfterImages);
  const screenWidth = Dimensions.get("window").width;
  const [loadingAfter, setLoadingAfter] = useState(true);
  const [loadingBefore, setLoadingBefore] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="Resultado da Simulação IA" showLogo={false} />
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}
      >
        <Text className="text-base text-center mb-5 px-5 text-gray-600">
          Visualização clara do antes/depois gerado por IA (simulado).
        </Text>

        {/* Imagem DEPOIS em tela cheia */}
        <View className="w-full mb-4">
          {loadingAfter && (
            <View
              className="w-full items-center justify-center bg-gray-100 rounded-lg"
              style={{ height: screenWidth * 1.2 }}
            >
              <View className="items-center">
                <View className="w-12 h-12 border-4 border-primary-main border-t-transparent rounded-full animate-spin mb-2" />
                <Text className="text-gray-600">Carregando simulação...</Text>
              </View>
            </View>
          )}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Image
              source={{ uri: images.after }}
              className="w-full"
              style={{ height: screenWidth * 1.2 }}
              resizeMode="cover"
              onLoadStart={() => setLoadingAfter(true)}
              onLoadEnd={() => {
                setLoadingAfter(false);
                fadeIn();
              }}
            />
          </Animated.View>
          <Text className="text-center mt-2 font-semibold text-gray-700">
            DEPOIS (Simulado)
          </Text>
        </View>

        {/* Imagem ANTES em card menor */}
        <View className="w-1/2 mb-4">
          {loadingBefore && (
            <View className="w-full aspect-square items-center justify-center bg-gray-100 rounded-lg mb-2">
              <View className="items-center">
                <View className="w-8 h-8 border-3 border-primary-main border-t-transparent rounded-full animate-spin mb-2" />
                <Text className="text-gray-600 text-sm">Carregando...</Text>
              </View>
            </View>
          )}
          <PhotoCard
            uri={images.before}
            label="ANTES"
            onLoadStart={() => setLoadingBefore(true)}
            onLoadEnd={() => setLoadingBefore(false)}
          />
        </View>
      </ScrollView>

      <View className="p-5 border-t border-gray-200">
        <CustomButton
          title="Enviar para Clínica"
          onPress={() =>
            router.push({
              pathname: "/send-to-clinic",
              params: { simulationResult: beforeAfterImages },
            })
          }
          icon="send-outline"
          primary={true}
        />
        <CustomButton
          title="Nova Simulação"
          onPress={() => router.push("/")}
          icon="refresh-outline"
          primary={false}
        />
        <CustomButton
          title="Ver Histórico"
          onPress={() => router.push("/history")}
          icon="time-outline"
          primary={false}
        />
      </View>
    </View>
  );
}

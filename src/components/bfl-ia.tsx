import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  LayoutChangeEvent,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import CustomButton from "../components/CustomButton";
import { simulateHairTransplant } from "../services/api";
import { saveSimulation } from "../services/storage";
import { colors } from "../theme";

export default function BflIa() {
  const router = useRouter();
  const { photo, maskPoints } = useLocalSearchParams<{
    photo: string;
    maskPoints: string;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [showFullScreenPhoto, setShowFullScreenPhoto] = useState(false);
  const viewShotRef = React.useRef<ViewShot>(null);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [imageBox, setImageBox] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);
  const [selectedShape, setSelectedShape] = useState<number>(1);
  const [selectedAI, setSelectedAI] = useState<"fastgan" | "bfl">("fastgan");
  const [loadingProgress] = useState(new Animated.Value(0));
  const [loadingText, setLoadingText] = useState(
    "Processando sua simulação..."
  );
  const shapesSectionAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (photo) {
      startPulseAnimation();
    }
  }, [photo]);

  /**
   * Efeito para animar a seção de shapes quando a IA é alterada
   */
  useEffect(() => {
    if (selectedAI === "fastgan") {
      // Animar aparecimento
      Animated.timing(shapesSectionAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // Animar desaparecimento
      Animated.timing(shapesSectionAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [selectedAI]);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingProgress, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(loadingProgress, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Simular diferentes mensagens de loading
      const messages = [
        "Analisando seu padrão capilar...",
        "Calculando densidade ideal...",
        "Gerando simulação personalizada...",
        "Aplicando efeitos de IA...",
      ];

      let currentIndex = 0;
      const interval = setInterval(() => {
        setLoadingText(messages[currentIndex]);
        currentIndex = (currentIndex + 1) % messages.length;
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  /**
   * Função para processar a simulação de transplante capilar
   * Agora utiliza apenas BFL
   */
  const handleSimulate = async () => {
    if (!photo) {
      Alert.alert("Erro", "A foto não está disponível.");
      return;
    }
    setIsLoading(true);
    try {
      // Enviando a foto original do usuário para BFL
      const simulationResult = await simulateHairTransplant(photo);
      await saveSimulation(simulationResult);
      router.push({
        pathname: "/result",
        params: { beforeAfterImages: JSON.stringify(simulationResult) },
      });
    } catch (error) {
      console.error("Erro durante a simulação:", error);
      Alert.alert(
        "Erro na Simulação",
        `Não foi possível gerar a simulação.\n\n${
          error.message ?? JSON.stringify(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width && height) {
      setContainerSize({ width, height });
    }
  };

  const onImageLayout = () => {
    if (!containerSize || !imageDimensions) {
      return;
    }

    const containerRatio = containerSize.width / containerSize.height;
    const imageRatio = imageDimensions.width / imageDimensions.height;
    let width, height, x, y;

    if (imageRatio > containerRatio) {
      // imagem ocupa toda a largura
      width = containerSize.width;
      height = width / imageRatio;
      x = 0;
      y = (containerSize.height - height) / 2;
    } else {
      // imagem ocupa toda a altura
      height = containerSize.height;
      width = height * imageRatio;
      y = 0;
      x = (containerSize.width - width) / 2;
    }

    if (width && height) {
      setImageBox({ width, height, x, y });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-default">
      <View className="flex-1">
        {/* Área da Imagem Principal */}
        <View className="flex-1 px-4">
          <View
            className="flex-1 w-full rounded-lg overflow-hidden justify-center items-center"
            onLayout={onContainerLayout}
          >
            {photo && (
              <View
                className="w-full h-full justify-center items-center"
                style={{
                  aspectRatio:
                    imageDimensions?.width && imageDimensions?.height
                      ? imageDimensions.width / imageDimensions.height
                      : 1,
                }}
              >
                <Image
                  source={{ uri: photo }}
                  className="w-full h-full"
                  resizeMode="contain"
                  onLayout={onImageLayout}
                  onError={(error) => {
                    console.error(
                      "Erro ao carregar imagem:",
                      error.nativeEvent
                    );
                    Alert.alert("Erro", "Não foi possível carregar a imagem.");
                  }}
                />
              </View>
            )}
          </View>
        </View>

        {/* Área de Status e Botões */}
        <View className="px-4 py-4 bg-background-default">
          {isLoading ? (
            <View className="items-center justify-center py-4">
              <View className="w-full h-16 bg-background-light rounded-xl overflow-hidden mb-4">
                <Animated.View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: loadingProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                    backgroundColor: colors.primary.main,
                    opacity: 0.2,
                  }}
                />
                <View className="absolute inset-0 items-center justify-center">
                  {/* <ActivityIndicator
                    size="large"
                    color={colors.primary.main}
                    className="mb-2"
                  /> */}
                  <Text className="text-text-primary text-sm font-medium">
                    {loadingText}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <>
              <CustomButton
                title="Gerar Simulação IA"
                onPress={handleSimulate}
                icon="sparkles-outline"
                primary={true}
              />
              <View className="h-3" />
              <CustomButton
                title="Capturar Novamente"
                onPress={() => router.back()}
                icon="arrow-back-outline"
                primary={false}
                disabled={isLoading}
              />
            </>
          )}
        </View>
      </View>

      <ViewShot
        ref={viewShotRef}
        options={{
          format: "png",
          quality: 1,
        }}
        style={{
          width: imageDimensions?.width || 0,
          height: imageDimensions?.height || 0,
          position: "absolute",
          top: -9999,
          left: -9999,
          opacity: 0,
        }}
      />
    </SafeAreaView>
  );
}

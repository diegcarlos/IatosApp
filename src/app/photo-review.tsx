import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import { simulateHairTransplant } from "../services/api";
import { saveSimulation } from "../services/storage";
import { colors } from "../theme";

export default function PhotoReview() {
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
  const [selectedAI, setSelectedAI] = useState<'fastgan' | 'bfl'>('fastgan');
  const [loadingProgress] = useState(new Animated.Value(0));
  const [loadingText, setLoadingText] = useState(
    "Processando sua simulação..."
  );
  const shapesSectionAnim = React.useRef(new Animated.Value(1)).current;

  const hairShapes = [
    { id: 1, image: require("../assets/1.png") },
    { id: 2, image: require("../assets/2.png") },
    { id: 3, image: require("../assets/3.png") },
    { id: 4, image: require("../assets/4.png") },
    { id: 5, image: require("../assets/5.png") },
    {
      id: 6,
      image: require("../assets/6.png"),
      description: "Cabelo para trás",
    },
    {
      id: 7,
      image: require("../assets/7.png"),
      description: "Cabelo para trás",
    },
  ];

  useEffect(() => {
    if (photo) {
      startPulseAnimation();
    }
  }, [photo]);

  /**
   * Efeito para animar a seção de shapes quando a IA é alterada
   */
  useEffect(() => {
    if (selectedAI === 'fastgan') {
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
   * Utiliza a IA selecionada (FastGAN ou BFL) e o shape quando necessário
   */
  const handleSimulate = async () => {
    if (!photo) {
      Alert.alert("Erro", "A foto não está disponível.");
      return;
    }

    setIsLoading(true);

    try {
      // Enviando a foto original do usuário e os parâmetros baseados na IA selecionada
      const simulationResult = await simulateHairTransplant(
        [photo, photo], // Mantendo a foto original do usuário
        selectedAI === 'fastgan' ? selectedShape : null, // Shape apenas para FastGAN
        selectedAI // Passando o tipo de IA selecionada
      );


      await saveSimulation(simulationResult);
      router.push({
        pathname: "/result",
        params: { beforeAfterImages: JSON.stringify(simulationResult) },
      });
    } catch (error: any) {
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
      <Header title="Revisar Foto" showLogo={true} />

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

        

        {/* Área de Seleção de Shape - Apenas para FastGAN com Animação */}
        <Animated.View
          style={{
            maxHeight: shapesSectionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Altura máxima da seção
            }),
            opacity: shapesSectionAnim,
            overflow: 'hidden',
          }}
        >
          {selectedAI === 'fastgan' && (
            <View className="px-4 py-4 bg-background-light border-t border-background-dark">
              <Text className="text-text-secondary text-base mb-3 font-medium">
                Selecione o formato do cabelo:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: 16,
                  height: 120,
                }}
              >
                {hairShapes.map((shape) => (
                  <TouchableOpacity
                    key={shape.id}
                    onPress={() => setSelectedShape(shape.id)}
                    style={{
                      width: 100,
                      height: 100,
                      marginRight: 16,
                      borderRadius: 12,
                      backgroundColor: "white",
                      borderWidth: selectedShape === shape.id ? 2 : 1,
                      borderColor:
                        selectedShape === shape.id
                          ? colors.primary.main
                          : colors.background.dark,
                      padding: 8,
                      elevation: selectedShape === shape.id ? 8 : 4,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: selectedShape === shape.id ? 4 : 2,
                      },
                      shadowOpacity: selectedShape === shape.id ? 0.3 : 0.2,
                      shadowRadius: selectedShape === shape.id ? 6 : 4,
                    }}
                  >
                    <Image
                      source={shape.image}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="center"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </Animated.View>

        {/* Área de Seleção de IA */}
        <View className="px-4 py-4 bg-background-light">
          <Text className="text-text-secondary text-base mb-3 font-medium">
            Selecione o tipo de IA:
          </Text>
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setSelectedAI('fastgan')}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginRight: 8,
                borderRadius: 8,
                backgroundColor: selectedAI === 'fastgan' ? colors.primary.main : 'white',
                borderWidth: 1,
                borderColor: selectedAI === 'fastgan' ? colors.primary.main : colors.background.dark,
                elevation: selectedAI === 'fastgan' ? 4 : 2,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: selectedAI === 'fastgan' ? 2 : 1,
                },
                shadowOpacity: selectedAI === 'fastgan' ? 0.2 : 0.1,
                shadowRadius: selectedAI === 'fastgan' ? 4 : 2,
              }}
            >
              <Text style={{
                textAlign: 'center',
                fontWeight: '600',
                color: selectedAI === 'fastgan' ? 'white' : colors.text.primary,
              }}>
                FastGAN
              </Text>
              <Text style={{
                textAlign: 'center',
                fontSize: 12,
                marginTop: 2,
                color: selectedAI === 'fastgan' ? 'white' : colors.text.secondary,
              }}>
                Com shapes
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setSelectedAI('bfl')}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginLeft: 8,
                borderRadius: 8,
                backgroundColor: selectedAI === 'bfl' ? colors.primary.main : 'white',
                borderWidth: 1,
                borderColor: selectedAI === 'bfl' ? colors.primary.main : colors.background.dark,
                elevation: selectedAI === 'bfl' ? 4 : 2,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: selectedAI === 'bfl' ? 2 : 1,
                },
                shadowOpacity: selectedAI === 'bfl' ? 0.2 : 0.1,
                shadowRadius: selectedAI === 'bfl' ? 4 : 2,
              }}
            >
              <Text style={{
                textAlign: 'center',
                fontWeight: '600',
                color: selectedAI === 'bfl' ? 'white' : colors.text.primary,
              }}>
                BFL
              </Text>
              <Text style={{
                textAlign: 'center',
                fontSize: 12,
                marginTop: 2,
                color: selectedAI === 'bfl' ? 'white' : colors.text.secondary,
              }}>
                Automático
              </Text>
            </TouchableOpacity>
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

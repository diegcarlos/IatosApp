import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { BrushSizeControl } from "../components/BrushSizeControl";
import { ImagePainter } from "../components/ImagePainter";
import { MaskGenerator } from "../components/MaskGenerator";
import { Toolbar } from "../components/Toolbar";
import { DrawingProvider, useDrawing } from "../contexts/DrawingContext";
import { simulateHairTransplantStability } from "../services/api";
import { saveSimulation } from "../services/storage";
import { colors } from "../theme";
import { AgeType, VolumeType } from "../types";

interface Point {
  x: number;
  y: number;
}

function PhotoReviewContent() {
  const router = useRouter();
  const { photo } = useLocalSearchParams<{ photo: string }>();

  const {
    drawingPoints,
    hasSelection,
    maskUri,
    brushSize,
    imageDimensions,
    setDrawingPoints,
    setHasSelection,
    setMaskUri,
    setBrushSize,
    setImageDimensions,
    clearDrawing,
  } = useDrawing();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress] = useState(new Animated.Value(0));
  const [loadingText, setLoadingText] = useState(
    "Processando sua simulação..."
  );
  const [showMask, setShowMask] = useState(false);
  const [isGeneratingMask, setIsGeneratingMask] = useState(false);
  const [pendingSendToAI, setPendingSendToAI] = useState(false);

  // Novos estados para idade e volume
  const [selectedAge, setSelectedAge] = useState<AgeType>("young");
  const [selectedVolume, setSelectedVolume] = useState<VolumeType>("natural");

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

  const handleDrawingChange = useCallback((points: Point[]) => {
    setDrawingPoints(points);
    setHasSelection(points.length > 0);
  }, []);

  const handleDrawingComplete = useCallback(async (points: Point[]) => {
    if (points.length === 0 || !imageDimensions) return;
  }, []);

  const handleImageDimensionsChange = useCallback(
    (dimensions: { width: number; height: number }) => {
      setImageDimensions(dimensions);
    },
    []
  );

  const handleClearDrawing = useCallback(() => {
    clearDrawing();
    setShowMask(false);
  }, []);

  const handleCaptureAgain = useCallback(() => {
    router.back();
  }, [router]);

  const handleMaskGenerated = useCallback(
    (maskUri: string) => {
      setMaskUri(maskUri);
      setShowMask(true);
      setIsGeneratingMask(false);
      if (pendingSendToAI) {
        setPendingSendToAI(false);
        handleSendToAIWithMask(maskUri);
      }
    },
    [pendingSendToAI]
  );

  const handleSendToAIWithMask = useCallback(
    async (finalMaskUri: string) => {
      if (!photo) {
        Alert.alert("Erro", "A foto não está disponível.");
        return;
      }
      setIsLoading(true);
      try {
        const simulationResult = await simulateHairTransplantStability(
          photo,
          finalMaskUri,
          selectedAge,
          selectedVolume
        );
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
    },
    [photo, router, selectedAge, selectedVolume]
  );

  const handleSendToAI = useCallback(async () => {
    if (!photo) {
      Alert.alert("Erro", "A foto não está disponível.");
      return;
    }
    if (!hasSelection) {
      Alert.alert(
        "Área não selecionada",
        "Por favor, desenhe uma área sobre a imagem antes de continuar."
      );
      return;
    }
    if (maskUri) {
      handleSendToAIWithMask(maskUri);
    } else {
      setPendingSendToAI(true);
      setIsGeneratingMask(true);
    }
  }, [photo, hasSelection, maskUri, handleSendToAIWithMask]);

  const handleToggleMask = useCallback(async () => {
    if (!showMask && drawingPoints.length > 0 && imageDimensions) {
      try {
        setIsGeneratingMask(true);
      } catch (error) {
        console.error("Erro ao gerar máscara:", error);
        Alert.alert("Erro", "Falha ao gerar a máscara. Tente novamente.");
        setIsGeneratingMask(false);
      }
    } else {
      setShowMask(false);
    }
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.default }}
    >
      {/* TOPO: Seletor de IA (se houver) */}
      {/* <View style={{ height: 56, justifyContent: 'center', backgroundColor: colors.background.paper }}>
        <AgeVolumeSelector ... />
      </View> */}

      {/* MEIO: Área de desenho (imagem) */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {isGeneratingMask ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              Gerando Máscara...
            </Text>
          </View>
        ) : (
          <ImagePainter
            imageUri={photo}
            brushSize={brushSize}
            onDrawingChange={handleDrawingChange}
            onDrawingComplete={handleDrawingComplete}
            onImageDimensionsChange={handleImageDimensionsChange}
            isDrawingEnabled={!isLoading}
            showMask={showMask}
            onToggleMask={handleToggleMask}
          />
        )}
        {/* MaskGenerator - renderizado fora da tela */}
        {isGeneratingMask && imageDimensions && drawingPoints.length > 0 && (
          <MaskGenerator
            width={imageDimensions.width}
            height={imageDimensions.height}
            points={drawingPoints}
            brushSize={(() => {
              // brushSize é relativo ao canvas, converter para imagem original
              // Obter o tamanho do canvas usado no ImagePainter
              const screenWidth = Dimensions.get("window").width - 32;
              const screenHeight = Dimensions.get("window").height - 180; // Considera topo e base
              const aspectRatio =
                imageDimensions.width / imageDimensions.height;
              let canvasWidth = screenWidth;
              let canvasHeight = screenWidth / aspectRatio;
              if (canvasHeight > screenHeight) {
                canvasHeight = screenHeight;
                canvasWidth = screenHeight * aspectRatio;
              }
              const scaleX = imageDimensions.width / canvasWidth;
              const scaleY = imageDimensions.height / canvasHeight;
              return brushSize * Math.max(scaleX, scaleY);
            })()}
            onMaskGenerated={handleMaskGenerated}
          />
        )}
      </View>

      {/* BASE: Barra de controles (BrushSizeControl + Toolbar) */}
      <View
        style={{
          minHeight: 90,
          backgroundColor: colors.background.paper,
          paddingHorizontal: 8,
          paddingTop: 4,
          paddingBottom: 8,
        }}
      >
        <BrushSizeControl
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          minSize={10}
          maxSize={80}
          step={5}
        />
        <Toolbar
          onClearDrawing={handleClearDrawing}
          onCaptureAgain={handleCaptureAgain}
          onSendToAI={handleSendToAI}
          hasSelection={hasSelection}
          isLoading={isLoading}
          showMask={showMask}
          onToggleMask={handleToggleMask}
        />
      </View>

      {/* Loading Overlay */}
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 300,
                height: 64,
                backgroundColor: colors.background.dark,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
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
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  {loadingText}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function StabilityIa() {
  return (
    <DrawingProvider>
      <PhotoReviewContent />
    </DrawingProvider>
  );
}

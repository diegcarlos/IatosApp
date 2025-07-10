import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Animated, SafeAreaView, Text, View } from "react-native";
import ViewShot from "react-native-view-shot";
import Header from "../components/Header";
import { ImagePainter } from "../components/ImagePainter";
import { MaskGenerator } from "../components/MaskGenerator";
import { MaskViewer } from "../components/MaskViewer";
import { Toolbar } from "../components/Toolbar";
import { DrawingProvider, useDrawing } from "../contexts/DrawingContext";
import { simulateHairTransplant } from "../services/api";
import { saveSimulation } from "../services/storage";
import { colors } from "../theme";

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
    setImageDimensions,
    clearDrawing,
  } = useDrawing();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress] = useState(new Animated.Value(0));
  const [loadingText, setLoadingText] = useState(
    "Processando sua simulação..."
  );
  const [selectedAI, setSelectedAI] = useState<"fastgan" | "bfl">("fastgan");
  const [showMask, setShowMask] = useState(false);
  const [isGeneratingMask, setIsGeneratingMask] = useState(false);
  const viewShotRef = React.useRef<ViewShot>(null);

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

  const handleDrawingChange = useCallback(
    (points: Point[]) => {
      setDrawingPoints(points);
      setHasSelection(points.length > 0);
    },
    [setDrawingPoints, setHasSelection]
  );

  const handleDrawingComplete = useCallback(
    async (points: Point[]) => {
      if (points.length === 0 || !imageDimensions) return;

      try {
        const mockMaskData =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
        setMaskUri(mockMaskData);
      } catch (error) {
        console.error("Erro ao gerar máscara:", error);
      }
    },
    [imageDimensions?.width, imageDimensions?.height, setMaskUri]
  );

  const handleImageDimensionsChange = useCallback(
    (dimensions: { width: number; height: number }) => {
      setImageDimensions(dimensions);
    },
    [setImageDimensions]
  );

  const handleClearDrawing = useCallback(() => {
    clearDrawing();
    setShowMask(false);
  }, [clearDrawing]);

  const handleCaptureAgain = useCallback(() => {
    router.back();
  }, [router]);

  const handleMaskGenerated = useCallback(
    (maskUri: string) => {
      setMaskUri(maskUri);
      setShowMask(true);
      setIsGeneratingMask(false);
    },
    [setMaskUri]
  );

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
  }, [
    showMask,
    drawingPoints.length,
    imageDimensions?.width,
    imageDimensions?.height,
  ]);

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

    setIsLoading(true);
    try {
      const images: [string, string] = maskUri
        ? [photo, maskUri]
        : [photo, photo];

      const simulationResult = await simulateHairTransplant(
        images,
        null,
        selectedAI
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
  }, [photo, hasSelection, maskUri, selectedAI, router]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.default }}
    >
      <Header title="Revisar Foto" showLogo={true} />

      <View style={{ flex: 1 }}>
        {/* Área de desenho principal */}
        <View
          style={{
            flex: 1,
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {showMask && drawingPoints.length > 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 16,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                Visualizando Máscara Binária
              </Text>
              <MaskViewer
                width={imageDimensions?.width || 300}
                height={imageDimensions?.height || 300}
                points={drawingPoints}
                brushSize={brushSize}
              />
            </View>
          ) : isGeneratingMask ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
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
        </View>

        {/* MaskGenerator - renderizado fora da tela */}
        {isGeneratingMask && imageDimensions && drawingPoints.length > 0 && (
          <MaskGenerator
            width={imageDimensions.width}
            height={imageDimensions.height}
            points={drawingPoints}
            brushSize={brushSize}
            onMaskGenerated={handleMaskGenerated}
          />
        )}

        {/* Toolbar com controles */}
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

export default function PhotoReview() {
  return (
    <DrawingProvider>
      <PhotoReviewContent />
    </DrawingProvider>
  );
}

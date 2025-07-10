import React, { useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, View } from "react-native";
import ImageDrawingCanvas from "../components/ImageDrawingCanvas";
import { MaskPreview } from "../components/MaskPreview";
import { Toolbar } from "../components/Toolbar";
import { colors } from "../theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface PhotoReviewProps {
  photoUri: string;
  onCaptureAgain: () => void;
  onSendToAI: (maskData: string) => void;
}

export const PhotoReview: React.FC<PhotoReviewProps> = ({
  photoUri,
  onCaptureAgain,
  onSendToAI,
}) => {
  const [hasSelection, setHasSelection] = useState(false);
  const [showMask, setShowMask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [maskUri, setMaskUri] = useState<string | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<
    Array<{ x: number; y: number }>
  >([]);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const canvasRef = useRef<any>(null);

  const handleSelectionChange = (hasDrawing: boolean) => {
    setHasSelection(hasDrawing);
  };

  const handleMaskGenerated = (mask: string) => {
    setMaskUri(mask);
  };

  const handleClearDrawing = () => {
    if (canvasRef.current) {
      canvasRef.current.clearDrawing();
    }
    setHasSelection(false);
    setMaskUri(null);
    setDrawingPoints([]);
  };

  const handleToggleMask = () => {
    setShowMask(!showMask);
  };

  const handleSendToAI = async () => {
    if (!maskUri) {
      Alert.alert("Erro", "Nenhuma seleção foi feita na imagem.");
      return;
    }

    setIsLoading(true);
    try {
      await onSendToAI(maskUri);
    } catch (error) {
      Alert.alert("Erro", "Falha ao processar a imagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageLoad = (event: any) => {
    const { width, height } = event.nativeEvent;
    setImageDimensions({ width, height });
    setContainerSize({ width: screenWidth - 32, height: screenHeight * 0.6 });
  };

  return (
    <View style={styles.container}>
      {/* Área de visualização da imagem */}
      <View style={styles.imageContainer}>
        {showMask && maskUri ? (
          <MaskPreview
            originalImageUri={photoUri}
            maskUri={maskUri}
            points={drawingPoints}
            brushSize={20}
            imageWidth={imageDimensions?.width || screenWidth - 32}
            imageHeight={imageDimensions?.height || screenHeight * 0.6}
            onClear={handleClearDrawing}
          />
        ) : (
          <View style={styles.image}>
            <ImageDrawingCanvas
              imageUri={photoUri}
              imageDimensions={imageDimensions}
              containerSize={containerSize}
              onMaskGenerated={handleMaskGenerated}
              onSelectionChange={handleSelectionChange}
              brushSize={20}
            />
          </View>
        )}
      </View>

      {/* Toolbar */}
      <Toolbar
        onClearDrawing={handleClearDrawing}
        onCaptureAgain={onCaptureAgain}
        onSendToAI={handleSendToAI}
        hasSelection={hasSelection}
        isLoading={isLoading}
        showMask={showMask}
        onToggleMask={handleToggleMask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: screenWidth - 32,
    height: screenHeight * 0.6,
    borderRadius: 12,
  },
});

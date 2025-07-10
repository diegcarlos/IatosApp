import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../theme";

interface ImageDisplayProps {
  imageUri: string;
  onDimensionsChange: (dimensions: { width: number; height: number }) => void;
  onContainerLayout: (layout: { width: number; height: number }) => void;
  children?: React.ReactNode;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUri,
  onDimensionsChange,
  onContainerLayout,
  children,
}) => {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dimensões da imagem
  useEffect(() => {
    if (imageUri) {
      setIsLoading(true);
      setError(null);

      Image.getSize(
        imageUri,
        (width, height) => {
          setImageDimensions({ width, height });
          onDimensionsChange({ width, height });
          setIsLoading(false);
        },
        (error) => {
          console.error("Erro ao carregar dimensões da imagem:", error);
          setError("Erro ao carregar imagem");
          setIsLoading(false);
        }
      );
    }
  }, [imageUri, onDimensionsChange]);

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setContainerSize({ width, height });
      onContainerLayout({ width, height });
    }
  };

  const calculateImageStyle = () => {
    if (!containerSize || !imageDimensions) {
      return {
        width: containerSize?.width || 0,
        height: containerSize?.height || 0,
      };
    }

    const containerRatio = containerSize.width / containerSize.height;
    const imageRatio = imageDimensions.width / imageDimensions.height;

    if (imageRatio > containerRatio) {
      // Imagem é mais larga que o container - usar largura total
      return {
        width: containerSize.width,
        height: containerSize.width / imageRatio,
      };
    } else {
      // Imagem é mais alta que o container - usar altura total
      return {
        width: containerSize.height * imageRatio,
        height: containerSize.height,
      };
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer} onLayout={handleContainerLayout}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Carregando imagem...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer} onLayout={handleContainerLayout}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!imageDimensions) {
    return (
      <View style={styles.errorContainer} onLayout={handleContainerLayout}>
        <Text style={styles.errorText}>Imagem não disponível</Text>
      </View>
    );
  }

  const imageStyle = calculateImageStyle();

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
          onError={(error) => {
            console.error("Erro ao carregar imagem:", error.nativeEvent);
            setError("Erro ao carregar imagem");
          }}
        />

        {/* Canvas de desenho sobreposto */}
        {children && (
          <View style={[styles.canvasOverlay, imageStyle]}>{children}</View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.dark,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.dark,
  },
  errorText: {
    fontSize: 16,
    color: colors.status.error,
    textAlign: "center",
  },
  imageWrapper: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 8,
    zIndex: 1,
  },
  canvasOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 8,
    zIndex: 50,
    overflow: "hidden",
  },
});

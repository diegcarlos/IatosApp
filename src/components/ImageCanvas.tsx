import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import { colors } from "../theme";

interface Point {
  x: number;
  y: number;
}

interface ImageCanvasProps {
  imageUri: string;
  onMaskGenerated: (maskUri: string) => void;
  onSelectionChange: (hasSelection: boolean) => void;
  brushSize: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ImageCanvas({
  imageUri,
  onMaskGenerated,
  onSelectionChange,
  brushSize,
}: ImageCanvasProps) {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (!containerSize || !imageDimensions) return;

        const { locationX, locationY } = evt.nativeEvent;
        const imageX =
          (locationX / containerSize.width) * imageDimensions.width;
        const imageY =
          (locationY / containerSize.height) * imageDimensions.height;

        setIsDrawing(true);
        setDrawingPoints([{ x: imageX, y: imageY }]);
      },
      onPanResponderMove: (evt) => {
        if (!isDrawing || !containerSize || !imageDimensions) return;

        const { locationX, locationY } = evt.nativeEvent;
        const imageX =
          (locationX / containerSize.width) * imageDimensions.width;
        const imageY =
          (locationY / containerSize.height) * imageDimensions.height;

        setDrawingPoints((prev) => [...prev, { x: imageX, y: imageY }]);
      },
      onPanResponderRelease: () => {
        setIsDrawing(false);
        if (drawingPoints.length > 0) {
          generateMask();
        }
      },
    })
  ).current;

  // Obter dimensões da imagem
  useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          setImageDimensions({ width, height });
        },
        (error) => {
          console.error("Error getting image dimensions:", error);
        }
      );
    }
  }, [imageUri]);

  // Verificar se há seleção
  useEffect(() => {
    onSelectionChange(drawingPoints.length > 0);
  }, [drawingPoints, onSelectionChange]);

  const onContainerLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const generateMask = async () => {
    if (!imageDimensions || drawingPoints.length === 0) return;

    try {
      // Aqui você implementaria a geração real da máscara
      // Por enquanto, vamos simular uma máscara base64
      const mockMaskData =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      onMaskGenerated(mockMaskData);
    } catch (error) {
      console.error("Erro ao gerar máscara:", error);
    }
  };

  const clearDrawing = () => {
    setDrawingPoints([]);
    onSelectionChange(false);
  };

  const createSvgPath = () => {
    if (drawingPoints.length < 2) return "";

    let path = `M ${drawingPoints[0].x} ${drawingPoints[0].y}`;

    for (let i = 1; i < drawingPoints.length; i++) {
      path += ` L ${drawingPoints[i].x} ${drawingPoints[i].y}`;
    }

    return path;
  };

  if (!imageDimensions || !containerSize) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingPlaceholder} />
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onContainerLayout}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.image,
            { width: containerSize.width, height: containerSize.height },
          ]}
          resizeMode="contain"
        />

        {/* Canvas de Desenho */}
        <View style={styles.canvasContainer} {...panResponder.panHandlers}>
          <Svg
            width={containerSize.width}
            height={containerSize.height}
            style={styles.svg}
          >
            <Defs>
              <LinearGradient
                id="brushGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop
                  offset="0%"
                  stopColor={colors.drawing.stroke}
                  stopOpacity="0.8"
                />
                <Stop
                  offset="100%"
                  stopColor={colors.drawing.fill}
                  stopOpacity="0.4"
                />
              </LinearGradient>
            </Defs>

            {/* Área de desenho */}
            {drawingPoints.length > 1 && (
              <Path
                d={createSvgPath()}
                stroke="url(#brushGradient)"
                strokeWidth={brushSize}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}

            {/* Pontos individuais */}
            {drawingPoints.map((point, index) => (
              <Circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={brushSize / 2}
                fill={colors.drawing.fill}
                stroke={colors.drawing.stroke}
                strokeWidth={2}
              />
            ))}
          </Svg>
        </View>
      </View>
    </View>
  );
}

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
  loadingPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: colors.background.paper,
    borderRadius: 12,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  canvasContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
});

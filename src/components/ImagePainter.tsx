import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

interface Point {
  x: number;
  y: number;
}

interface ImagePainterProps {
  imageUri: string;
  brushSize: number;
  onDrawingChange: (points: Point[]) => void;
  onDrawingComplete: (points: Point[]) => void;
  isDrawingEnabled?: boolean;
  showMask?: boolean;
  onToggleMask?: () => void;
  onImageDimensionsChange?: (dimensions: {
    width: number;
    height: number;
  }) => void;
}

export const ImagePainter: React.FC<ImagePainterProps> = ({
  imageUri,
  brushSize,
  onDrawingChange,
  onDrawingComplete,
  isDrawingEnabled = true,
  showMask = false,
  onToggleMask,
  onImageDimensionsChange,
}) => {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [imageStyle, setImageStyle] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [panResponder, setPanResponder] = useState<any>(null);

  const screenWidth = Dimensions.get("window").width - 32;
  const screenHeight = Dimensions.get("window").height * 0.6;

  // Obter dimensões da imagem
  useEffect(() => {
    if (imageUri) {
      Image.getSize(imageUri, (width, height) => {
        const aspectRatio = width / height;
        let newWidth = screenWidth;
        let newHeight = screenWidth / aspectRatio;

        if (newHeight > screenHeight) {
          newHeight = screenHeight;
          newWidth = screenHeight * aspectRatio;
        }

        setImageStyle({ width: newWidth, height: newHeight });
        setImageDimensions({ width, height });
        if (onImageDimensionsChange) {
          onImageDimensionsChange({ width, height });
        }
      });
    }
  }, [imageUri, screenWidth, screenHeight]);

  // Converter coordenadas do canvas para coordenadas da imagem original
  const getImageCoordinates = useCallback(
    (canvasX: number, canvasY: number): Point => {
      if (
        !imageDimensions ||
        imageStyle.width === 0 ||
        imageStyle.height === 0
      ) {
        return { x: 0, y: 0 };
      }

      const scaleX = imageDimensions.width / imageStyle.width;
      const scaleY = imageDimensions.height / imageStyle.height;

      const imageX = canvasX * scaleX;
      const imageY = canvasY * scaleY;

      return { x: imageX, y: imageY };
    },
    [
      imageDimensions?.width,
      imageDimensions?.height,
      imageStyle.width,
      imageStyle.height,
    ]
  );

  // Converter coordenadas da imagem original para coordenadas do SVG
  const getSvgCoordinates = useCallback(
    (imagePoint: Point): Point => {
      if (
        !imageDimensions ||
        imageStyle.width === 0 ||
        imageStyle.height === 0
      ) {
        return { x: 0, y: 0 };
      }

      const scaleX = imageStyle.width / imageDimensions.width;
      const scaleY = imageStyle.height / imageDimensions.height;

      const svgX = imagePoint.x * scaleX;
      const svgY = imagePoint.y * scaleY;

      return { x: svgX, y: svgY };
    },
    [
      imageDimensions?.width,
      imageDimensions?.height,
      imageStyle.width,
      imageStyle.height,
    ]
  );

  // Criar PanResponder quando as dimensões estiverem prontas
  useEffect(() => {
    if (imageDimensions && imageStyle.width > 0 && imageStyle.height > 0) {
      const newPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => isDrawingEnabled,
        onMoveShouldSetPanResponder: () => isDrawingEnabled,
        onPanResponderGrant: (evt) => {
          if (!isDrawingEnabled) return;

          const { locationX, locationY } = evt.nativeEvent;
          const imagePoint = getImageCoordinates(locationX, locationY);

          setIsDrawing(true);
          setDrawingPoints([imagePoint]);
          setTimeout(() => onDrawingChange([imagePoint]), 0);
        },
        onPanResponderMove: (evt) => {
          if (!isDrawingEnabled || !isDrawing) return;

          const { locationX, locationY } = evt.nativeEvent;
          const imagePoint = getImageCoordinates(locationX, locationY);

          setDrawingPoints((prev) => {
            const updated = [...prev, imagePoint];
            setTimeout(() => onDrawingChange(updated), 0);
            return updated;
          });
        },
        onPanResponderRelease: () => {
          if (!isDrawingEnabled) return;

          setIsDrawing(false);
          setDrawingPoints((currentPoints) => {
            if (currentPoints.length > 0) {
              setTimeout(() => onDrawingComplete(currentPoints), 0);
            }
            return currentPoints;
          });
        },
      });

      setPanResponder(newPanResponder);
    }
  }, [
    imageDimensions,
    imageStyle,
    isDrawingEnabled,
    isDrawing,
    onDrawingChange,
    onDrawingComplete,
    getImageCoordinates,
  ]);

  // Memoizar o SVG path para evitar recálculos desnecessários
  const svgPath = useMemo(() => {
    if (drawingPoints.length < 2) return "";

    const svgPoints = drawingPoints.map((point) => getSvgCoordinates(point));
    let path = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
    for (let i = 1; i < svgPoints.length; i++) {
      path += ` L ${svgPoints[i].x} ${svgPoints[i].y}`;
    }
    return path;
  }, [drawingPoints, getSvgCoordinates]);

  // Memoizar os pontos SVG para evitar recálculos
  const svgPoints = useMemo(() => {
    return drawingPoints.map((point) => getSvgCoordinates(point));
  }, [drawingPoints, getSvgCoordinates]);

  const clearCanvas = useCallback(() => {
    setDrawingPoints([]);
    setIsDrawing(false);
    onDrawingChange([]);
  }, [onDrawingChange]);

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: imageUri }}
        style={{ width: "100%", height: "100%", resizeMode: "contain" }}
      />
      {/* Canvas de desenho sobreposto */}
      {imageStyle.width > 0 &&
        imageStyle.height > 0 &&
        imageDimensions &&
        panResponder && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
            }}
            pointerEvents="box-none"
            {...panResponder.panHandlers}
          >
            <Svg width={imageStyle.width} height={imageStyle.height}>
              {/* Traçado principal */}
              {drawingPoints.length > 1 && (
                <Path
                  d={svgPath}
                  stroke="rgba(59, 130, 246, 0.4)"
                  strokeWidth={brushSize}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
              {/* Pontos individuais */}
              {svgPoints.map((svgPoint, index) => (
                <Circle
                  key={index}
                  cx={svgPoint.x}
                  cy={svgPoint.y}
                  r={brushSize / 2}
                  fill="rgba(59, 130, 246, 0.3)"
                />
              ))}
            </Svg>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 12,
    zIndex: 1,
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  maskButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    alignItems: "center",
  },
  maskButton: {
    width: "auto",
    minWidth: 200,
  },
});

import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

interface Point {
  x: number;
  y: number;
}

interface MaskViewerProps {
  width: number;
  height: number;
  points: Point[];
  brushSize: number;
}

export const MaskViewer: React.FC<MaskViewerProps> = ({
  width,
  height,
  points,
  brushSize,
}) => {
  const screenWidth = Dimensions.get("window").width - 32; // 16px padding on each side
  const screenHeight = Dimensions.get("window").height * 0.6; // 60% da altura da tela

  // Calcular dimensões do canvas para exibição (mesmo cálculo do ImagePainter)
  const aspectRatio = width / height;
  let canvasWidth = screenWidth;
  let canvasHeight = screenWidth / aspectRatio;

  if (canvasHeight > screenHeight) {
    canvasHeight = screenHeight;
    canvasWidth = screenHeight * aspectRatio;
  }

  // Converter coordenadas da imagem original para coordenadas do canvas (mesmo que ImagePainter)
  const getCanvasCoordinates = (imagePoint: Point): Point => {
    const scaleX = canvasWidth / width;
    const scaleY = canvasHeight / height;

    const canvasX = imagePoint.x * scaleX;
    const canvasY = imagePoint.y * scaleY;

    return { x: canvasX, y: canvasY };
  };

  const createSvgPath = () => {
    if (points.length < 2) return "";

    // Converter pontos para coordenadas do canvas
    const canvasPoints = points.map(getCanvasCoordinates);
    let path = `M ${canvasPoints[0].x} ${canvasPoints[0].y}`;
    for (let i = 1; i < canvasPoints.length; i++) {
      path += ` L ${canvasPoints[i].x} ${canvasPoints[i].y}`;
    }
    return path;
  };

  return (
    <View style={styles.outerContainer}>
      <View
        style={[styles.container, { width: canvasWidth, height: canvasHeight }]}
      >
        <Svg width={canvasWidth} height={canvasHeight}>
          {/* Fundo preto */}
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill="#000000"
          />

          {/* Traços brancos suaves */}
          {points.length > 1 && (
            <Path
              d={createSvgPath()}
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth={brushSize}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}

          {/* Pontos individuais */}
          {points.map((point, index) => {
            const canvasPoint = getCanvasCoordinates(point);
            return (
              <Circle
                key={index}
                cx={canvasPoint.x}
                cy={canvasPoint.y}
                r={brushSize / 2}
                fill="rgba(255, 255, 255, 0.7)"
              />
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#333333",
  },
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import React, { useEffect, useRef, useState } from "react";
import { PanResponder, StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

interface Point {
  x: number;
  y: number;
}

interface CanvasPainterProps {
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
  brushSize: number;
  onDrawingChange: (points: Point[]) => void;
  onDrawingComplete: (points: Point[]) => void;
}

export const CanvasPainter: React.FC<CanvasPainterProps> = ({
  width,
  height,
  imageWidth,
  imageHeight,
  brushSize,
  onDrawingChange,
  onDrawingComplete,
}) => {
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const isDrawingRef = useRef(false);

  // Chamar onDrawingChange quando drawingPoints mudar
  useEffect(() => {
    if (drawingPoints.length > 0) {
      onDrawingChange(drawingPoints);
    } else {
      // Se drawingPoints estiver vazio, também notificar
      onDrawingChange([]);
    }
  }, [drawingPoints, onDrawingChange]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;

        // Converter coordenadas do container para coordenadas da imagem
        const imageX = (locationX / width) * imageWidth;
        const imageY = (locationY / height) * imageHeight;

        const newPoint = { x: imageX, y: imageY };

        // IMPORTANTE: Definir isDrawing como true ANTES de adicionar o ponto
        isDrawingRef.current = true;
        setDrawingPoints([newPoint]);
      },
      onPanResponderMove: (evt) => {
        if (!isDrawingRef.current) {
          return;
        }

        const { locationX, locationY } = evt.nativeEvent;

        // Converter coordenadas do container para coordenadas da imagem
        const imageX = (locationX / width) * imageWidth;
        const imageY = (locationY / height) * imageHeight;

        const newPoint = { x: imageX, y: imageY };
        setDrawingPoints((prevPoints) => {
          const updatedPoints = [...prevPoints, newPoint];
          return updatedPoints;
        });
      },
      onPanResponderRelease: () => {
        isDrawingRef.current = false;
        if (drawingPoints.length > 0) {
          onDrawingComplete(drawingPoints);
        }
      },
    })
  ).current;

  const createSvgPath = () => {
    if (drawingPoints.length < 2) return "";

    // Converter coordenadas da imagem para coordenadas do SVG
    let path = `M ${(drawingPoints[0].x / imageWidth) * width} ${
      (drawingPoints[0].y / imageHeight) * height
    }`;

    for (let i = 1; i < drawingPoints.length; i++) {
      const svgX = (drawingPoints[i].x / imageWidth) * width;
      const svgY = (drawingPoints[i].y / imageHeight) * height;
      path += ` L ${svgX} ${svgY}`;
    }

    return path;
  };

  const getSvgPoint = (point: Point) => {
    return {
      x: (point.x / imageWidth) * width,
      y: (point.y / imageHeight) * height,
    };
  };

  const getSvgBrushSize = () => {
    // Ajustar tamanho do pincel para o SVG
    const calculatedSize = (brushSize / imageWidth) * width;
    return Math.max(40, calculatedSize); // Aumentando para 40px para ser bem maior
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg width={width} height={height} style={styles.svg}>
        {/* Camada de blur mais externa - muito transparente */}
        {drawingPoints.length > 1 && (
          <Path
            d={createSvgPath()}
            stroke="rgba(128, 0, 255, 0.1)"
            strokeWidth={getSvgBrushSize() + 20}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}

        {/* Camada de blur média */}
        {drawingPoints.length > 1 && (
          <Path
            d={createSvgPath()}
            stroke="rgba(128, 0, 255, 0.2)"
            strokeWidth={getSvgBrushSize() + 10}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}

        {/* Traçado principal */}
        {drawingPoints.length > 1 && (
          <Path
            d={createSvgPath()}
            stroke="rgba(128, 0, 255, 0.5)"
            strokeWidth={getSvgBrushSize()}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}

        {/* Pontos individuais com efeito de blur melhorado */}
        {drawingPoints.map((point, index) => {
          const svgPoint = getSvgPoint(point);
          const brushSize = getSvgBrushSize();
          return (
            <React.Fragment key={index}>
              {/* Camada de blur mais externa do ponto */}
              <Circle
                cx={svgPoint.x}
                cy={svgPoint.y}
                r={brushSize / 2 + 15}
                fill="rgba(128, 0, 255, 0.1)"
              />
              {/* Camada de blur média do ponto */}
              <Circle
                cx={svgPoint.x}
                cy={svgPoint.y}
                r={brushSize / 2 + 8}
                fill="rgba(128, 0, 255, 0.2)"
              />
              {/* Ponto principal */}
              <Circle
                cx={svgPoint.x}
                cy={svgPoint.y}
                r={brushSize / 2}
                fill="rgba(128, 0, 255, 0.5)"
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    backgroundColor: "transparent",
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 50,
  },
});

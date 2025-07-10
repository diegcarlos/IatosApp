import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
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

interface ImageDrawingCanvasProps {
  imageUri: string;
  imageDimensions: { width: number; height: number } | null;
  containerSize: { width: number; height: number } | null;
  onMaskGenerated: (maskUri: string) => void;
  onSelectionChange: (hasSelection: boolean) => void;
  brushSize: number;
}

export default function ImageDrawingCanvas({
  imageUri,
  imageDimensions,
  containerSize,
  onMaskGenerated,
  onSelectionChange,
  brushSize,
}: ImageDrawingCanvasProps) {
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const panRef = useRef(null);

  // Verificar se há seleção
  useEffect(() => {
    onSelectionChange(drawingPoints.length > 0);
  }, [drawingPoints, onSelectionChange]);

  const onGestureEvent = (event: any) => {
    if (!containerSize || !imageDimensions) return;

    const { x, y } = event.nativeEvent;

    // Verificar se o toque está dentro dos limites da imagem
    if (x < 0 || y < 0 || x > containerSize.width || y > containerSize.height) {
      return;
    }

    // Converter coordenadas do container para coordenadas da imagem
    const imageX = (x / containerSize.width) * imageDimensions.width;
    const imageY = (y / containerSize.height) * imageDimensions.height;

    if (event.nativeEvent.state === State.BEGAN) {
      setIsDrawing(true);
      setDrawingPoints([{ x: imageX, y: imageY }]);
    } else if (event.nativeEvent.state === State.ACTIVE && isDrawing) {
      setDrawingPoints((prev) => [...prev, { x: imageX, y: imageY }]);
    } else if (event.nativeEvent.state === State.END) {
      setIsDrawing(false);
      if (drawingPoints.length > 0) {
        generateMask();
      }
    }
  };

  const generateMask = async () => {
    if (!imageDimensions || drawingPoints.length === 0) return;

    try {
      // Para React Native, vamos criar uma máscara simples
      // Em uma implementação real, você usaria uma biblioteca como react-native-canvas
      // ou enviaria os pontos para o backend para gerar a máscara

      // Por enquanto, vamos simular uma máscara base64 simples
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

  if (!containerSize || !imageDimensions) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onGestureEvent}
        minDist={0}
        activeOffsetX={0}
        activeOffsetY={0}
      >
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <Svg
            width={containerSize.width}
            height={containerSize.height}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 10 }}
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
      </PanGestureHandler>
    </View>
  );
}

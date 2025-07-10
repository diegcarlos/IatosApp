import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import ViewShot from "react-native-view-shot";

interface Point {
  x: number;
  y: number;
}

interface MaskExporterProps {
  width: number;
  height: number;
  points: Point[];
  brushSize: number;
  onMaskGenerated: (maskUri: string) => void;
}

export const useMaskExporter = () => {
  const generateMaskFromPoints = async (
    width: number,
    height: number,
    points: Point[],
    brushSize: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // Criar um componente temporário para gerar a máscara
        const MaskComponent = () => (
          <ViewShot
            options={{
              format: "png",
              quality: 1,
            }}
            style={{ width, height }}
            onCapture={(uri) => resolve(uri)}
            onCaptureFailure={(error) => reject(error)}
          >
            <Svg width={width} height={height}>
              {/* Fundo preto */}
              <Rect x={0} y={0} width={width} height={height} fill="#000000" />

              {/* Traços brancos */}
              {points.length > 1 && (
                <Path
                  d={createSvgPath(points)}
                  stroke="#FFFFFF"
                  strokeWidth={brushSize}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}

              {/* Pontos individuais */}
              {points.map((point, index) => (
                <Path
                  key={index}
                  d={`M ${point.x - brushSize / 2} ${
                    point.y - brushSize / 2
                  } L ${point.x + brushSize / 2} ${point.y + brushSize / 2}`}
                  stroke="#FFFFFF"
                  strokeWidth={brushSize}
                  strokeLinecap="round"
                />
              ))}
            </Svg>
          </ViewShot>
        );

        // Renderizar o componente temporariamente
        const tempView = <MaskComponent />;
        // O ViewShot irá capturar automaticamente e chamar onCapture
      } catch (error) {
        reject(error);
      }
    });
  };

  const createSvgPath = (points: Point[]): string => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  return { generateMaskFromPoints };
};

export const MaskExporter: React.FC<MaskExporterProps> = ({
  width,
  height,
  points,
  brushSize,
  onMaskGenerated,
}) => {
  const { generateMaskFromPoints } = useMaskExporter();

  React.useEffect(() => {
    if (points.length > 0) {
      generateMaskFromPoints(width, height, points, brushSize)
        .then(onMaskGenerated)
        .catch(console.error);
    }
  }, [
    points,
    width,
    height,
    brushSize,
    onMaskGenerated,
    generateMaskFromPoints,
  ]);

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -9999,
    left: -9999,
    opacity: 0,
  },
  canvas: {
    flex: 1,
  },
});

import React from "react";
import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import ViewShot from "react-native-view-shot";

interface Point {
  x: number;
  y: number;
}

interface MaskGeneratorProps {
  width: number;
  height: number;
  points: Point[];
  brushSize: number;
  onMaskGenerated: (maskUri: string) => void;
}

export const MaskGenerator: React.FC<MaskGeneratorProps> = ({
  width,
  height,
  points,
  brushSize,
  onMaskGenerated,
}) => {
  const viewShotRef = React.useRef<ViewShot>(null);

  React.useEffect(() => {
    if (points.length > 0 && viewShotRef.current) {
      setTimeout(() => {
        viewShotRef.current
          ?.capture()
          .then((uri) => {
            onMaskGenerated(uri);
          })
          .catch((error) => {
            console.error("Erro ao capturar máscara:", error);
          });
      }, 100);
    }
  }, [points, onMaskGenerated]);

  const createSvgPath = () => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  return (
    <View style={{ position: "absolute", top: -9999, left: -9999, opacity: 0 }}>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: "png",
          quality: 1,
          result: "tmpfile",
          width,
          height,
        }}
        style={{ width, height }}
      >
        <Svg width={width} height={height}>
          {/* Fundo preto */}
          <Rect x={0} y={0} width={width} height={height} fill="#000000" />

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
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={brushSize / 2}
              fill="rgba(255, 255, 255, 0.7)"
            />
          ))}
        </Svg>
      </ViewShot>
    </View>
  );
};

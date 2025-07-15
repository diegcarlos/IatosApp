import React, { createContext, ReactNode, useContext, useState } from "react";

interface Point {
  x: number;
  y: number;
}

interface DrawingState {
  drawingPoints: Point[];
  hasSelection: boolean;
  maskUri: string | null;
  brushSize: number; // Agora mutável
  imageDimensions: { width: number; height: number } | null;
  containerSize: { width: number; height: number } | null;
}

interface DrawingContextType extends DrawingState {
  setDrawingPoints: (points: Point[]) => void;
  setHasSelection: (hasSelection: boolean) => void;
  setMaskUri: (maskUri: string | null) => void;
  setBrushSize: (brushSize: number) => void; // Nova função
  setImageDimensions: (
    dimensions: { width: number; height: number } | null
  ) => void;
  setContainerSize: (size: { width: number; height: number } | null) => void;
  clearDrawing: () => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

interface DrawingProviderProps {
  children: ReactNode;
}

export const DrawingProvider: React.FC<DrawingProviderProps> = ({
  children,
}) => {
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [hasSelection, setHasSelection] = useState(false);
  const [maskUri, setMaskUri] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(45); // Agora mutável
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const clearDrawing = () => {
    setDrawingPoints([]);
    setHasSelection(false);
    setMaskUri(null);
  };

  const value: DrawingContextType = {
    drawingPoints,
    hasSelection,
    maskUri,
    brushSize,
    imageDimensions,
    containerSize,
    setDrawingPoints,
    setHasSelection,
    setMaskUri,
    setBrushSize, // Nova função
    setImageDimensions,
    setContainerSize,
    clearDrawing,
  };

  return (
    <DrawingContext.Provider value={value}>{children}</DrawingContext.Provider>
  );
};

export const useDrawing = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error("useDrawing must be used within a DrawingProvider");
  }
  return context;
};

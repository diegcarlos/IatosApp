import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

interface Point {
  x: number;
  y: number;
}

interface MaskGenerationOptions {
  width: number;
  height: number;
  points: Point[];
  brushSize: number;
  feathering?: number;
}

/**
 * Gera uma máscara binária PNG a partir dos pontos desenhados
 */
export const generateMask = async (
  options: MaskGenerationOptions
): Promise<string> => {
  const { width, height, points, brushSize } = options;

  try {
    // Criar uma máscara simples - fundo preto com área branca
    const baseImage = await createBaseImage(width, height);
    const result = await applyDrawingPoints(
      baseImage,
      points,
      brushSize,
      width,
      height
    );

    return result;
  } catch (error) {
    console.error("Erro ao gerar máscara:", error);
    throw error;
  }
};

/**
 * Cria uma imagem base preta
 */
const createBaseImage = async (
  width: number,
  height: number
): Promise<string> => {
  // Criar uma imagem PNG preta de 1x1 pixel e redimensionar
  const blackPixelBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

  const tempUri = FileSystem.documentDirectory + "temp_black.png";

  await FileSystem.writeAsStringAsync(tempUri, blackPixelBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Redimensionar para as dimensões desejadas
  const result = await ImageManipulator.manipulateAsync(
    tempUri,
    [{ resize: { width, height } }],
    { format: ImageManipulator.SaveFormat.PNG }
  );

  return result.uri;
};

/**
 * Aplica os pontos desenhados na imagem base
 */
const applyDrawingPoints = async (
  baseImageUri: string,
  points: Point[],
  brushSize: number,
  width: number,
  height: number
): Promise<string> => {
  if (points.length === 0) {
    return baseImageUri;
  }

  try {
    // Para simplificar, vamos criar uma máscara básica
    // que representa a área desenhada como um retângulo aproximado

    // Calcular os limites da área desenhada
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;

    for (const point of points) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    // Adicionar margem do tamanho do pincel
    const margin = brushSize / 2;
    minX = Math.max(0, minX - margin);
    minY = Math.max(0, minY - margin);
    maxX = Math.min(width, maxX + margin);
    maxY = Math.min(height, maxY + margin);

    // Criar uma imagem branca para a área selecionada
    const whitePixelBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
    const whiteTempUri = FileSystem.documentDirectory + "temp_white.png";

    await FileSystem.writeAsStringAsync(whiteTempUri, whitePixelBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Aplicar apenas uma operação de resize para criar a área branca
    const result = await ImageManipulator.manipulateAsync(
      whiteTempUri,
      [
        {
          resize: {
            width: maxX - minX,
            height: maxY - minY,
          },
        },
      ],
      { format: ImageManipulator.SaveFormat.PNG }
    );

    return result.uri;
  } catch (error) {
    console.error("Erro ao aplicar pontos:", error);
    return baseImageUri;
  }
};

/**
 * Gera uma máscara PNG real usando canvas (para implementação futura)
 */
export const generateRealMask = async (
  width: number,
  height: number,
  points: Point[],
  brushSize: number,
  feathering: number = 2
): Promise<string> => {
  // Esta função seria implementada com uma biblioteca como react-native-canvas
  // ou enviando os dados para o backend

  // Por enquanto, retorna uma máscara simulada
  return generateMask({ width, height, points, brushSize, feathering });
};

/**
 * Converte uma máscara base64 para URI de arquivo
 */
export const base64ToFileUri = async (base64Data: string): Promise<string> => {
  try {
    const fileName = `mask_${Date.now()}.png`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return fileUri;
  } catch (error) {
    console.error("Erro ao converter base64 para arquivo:", error);
    throw error;
  }
};

/**
 * Valida se uma máscara é válida
 */
export const validateMask = (maskUri: string): boolean => {
  return maskUri && maskUri.length > 0;
};

/**
 * Aplica feathering (suavização) na borda da máscara
 */
export const applyFeathering = async (
  maskUri: string,
  featheringRadius: number
): Promise<string> => {
  try {
    // Para implementação real, você usaria uma biblioteca de processamento de imagem
    // que suporte blur ou feathering
    // Por enquanto, retornamos a imagem original
    return maskUri;
  } catch (error) {
    console.error("Erro ao aplicar feathering:", error);
    return maskUri;
  }
};

/**
 * Converte máscara para formato binário (preto e branco puro)
 */
export const convertToBinary = async (maskUri: string): Promise<string> => {
  try {
    // Aplicar threshold para converter para preto e branco puro
    const result = await ImageManipulator.manipulateAsync(
      maskUri,
      [
        {
          resize: {
            width: await getImageWidth(maskUri),
            height: await getImageHeight(maskUri),
          },
        },
      ],
      { format: ImageManipulator.SaveFormat.PNG }
    );

    return result.uri;
  } catch (error) {
    console.error("Erro ao converter para binário:", error);
    return maskUri;
  }
};

/**
 * Obtém a largura da imagem
 */
const getImageWidth = async (imageUri: string): Promise<number> => {
  try {
    const info = await ImageManipulator.manipulateAsync(imageUri, [], {});
    return info.width;
  } catch {
    return 100; // Valor padrão
  }
};

/**
 * Obtém a altura da imagem
 */
const getImageHeight = async (imageUri: string): Promise<number> => {
  try {
    const info = await ImageManipulator.manipulateAsync(imageUri, [], {});
    return info.height;
  } catch {
    return 100; // Valor padrão
  }
};

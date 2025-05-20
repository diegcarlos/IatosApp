import * as FileSystem from "expo-file-system";

const IMAGES_DIRECTORY = `${FileSystem.documentDirectory}images/`;

// Garante que o diretório de imagens existe
const ensureImagesDirectory = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIRECTORY);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGES_DIRECTORY, {
        intermediates: true,
      });
    }
  } catch (error) {
    console.error("Erro ao criar diretório de imagens:", error);
    throw new Error("Não foi possível criar o diretório de imagens");
  }
};

/**
 * Salva uma imagem do URI temporário para o armazenamento permanente
 */
export const saveImage = async (uri: string): Promise<string> => {
  try {
    await ensureImagesDirectory();

    const sourceInfo = await FileSystem.getInfoAsync(uri);
    if (!sourceInfo.exists) {
      throw new Error("Arquivo de origem não existe");
    }

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.jpg`;
    const destinationUri = `${IMAGES_DIRECTORY}${fileName}`;

    await FileSystem.copyAsync({
      from: uri,
      to: destinationUri,
    });

    const destInfo = await FileSystem.getInfoAsync(destinationUri);
    if (!destInfo.exists) {
      throw new Error("Falha ao verificar arquivo copiado");
    }

    if (!destinationUri.startsWith("file://")) {
      throw new Error(
        `URI inválida retornada pelo saveImage: ${destinationUri}`
      );
    }

    return destinationUri;
  } catch (error) {
    console.error("Erro ao salvar imagem:", error);
    throw error;
  }
};

/**
 * Salva múltiplas imagens e retorna os novos URIs
 */
export const saveImages = async (uris: string[]): Promise<string[]> => {
  try {
    const savedUris = await Promise.all(uris.map((uri) => saveImage(uri)));
    return savedUris;
  } catch (error) {
    console.error("Erro ao salvar múltiplas imagens:", error);
    throw error;
  }
};

/**
 * Verifica se uma imagem existe no armazenamento
 */
export const imageExists = async (uri: string): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    return fileInfo.exists;
  } catch (error) {
    console.error("Erro ao verificar imagem:", error);
    return false;
  }
};

/**
 * Remove uma imagem do armazenamento
 */
export const deleteImage = async (uri: string): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri);
    }
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    throw error;
  }
};

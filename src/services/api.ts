import { GeneratedType } from "@/types";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import "react-native-get-random-values";

type FileInput = {
  uri: string;
  type: string;
  name: string;
};

const shapeAssets = {
  1: require("../assets/1_shape.png"),
  2: require("../assets/2_shape.png"),
  3: require("../assets/3_shape.png"),
  4: require("../assets/4_shape.png"),
  5: require("../assets/5_shape.png"),
  6: require("../assets/6_shape.png"),
  7: require("../assets/7_shape.png"),
};

/**
 * Simula o processamento de imagens pela IA para gerar o resultado do transplante capilar.
 */
export const simulateHairTransplant = async (
  images: [string, string],
  shapeImage: number,
  typeIa: 'fastgan' | 'bfl'
): Promise<{ before: string; after: string }> => {
  try {
    const formData = new FormData();

    

    const prepareFile = async (
      uri: string,
      type: string,
      name: string
    ): Promise<FileInput> => {
      try {


        if (!uri) {
          throw new Error(`URI inválida para o arquivo ${name}`);
        }

        // Caso seja asset embutido (ex: require('../assets/shape.webp'))
        if (
          !uri.startsWith("file://") &&
          !uri.startsWith("content://") &&
          !uri.startsWith("http")
        ) {
          const asset = Asset.fromURI(uri);
          await asset.downloadAsync();
          const localUri = asset.localUri || asset.uri;

          if (!localUri || !localUri.startsWith("file://")) {
            throw new Error(`Asset inválido: ${uri}`);
          }
          uri = localUri;
        }

        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          throw new Error(`Arquivo não encontrado em: ${uri}`);
        }
        if (fileInfo.size === 0) {
          throw new Error(`Arquivo vazio em: ${uri}`);
        }

        return {
          uri,
          type,
          name,
        };
      } catch (error) {
        console.error("Erro ao preparar arquivo:", error);
        throw error;
      }
    };


    // Verificação do tipo de IA e preparação dos arquivos
    let url: string;
    
    if (typeIa === 'fastgan') {
      // Validação do shapeImage
    if (!shapeImage || shapeImage < 1 || shapeImage > 7) {
      throw new Error(
        `Shape ${shapeImage} inválido. Use um número entre 1 e 7.`
      );
    }

    // Verifica se o shape existe no objeto shapeAssets
    if (!(shapeImage in shapeAssets)) {
      throw new Error(
        `Shape ${shapeImage} não encontrado nos assets disponíveis`
      );
    }

    const shapeModule = shapeAssets[shapeImage as keyof typeof shapeAssets];

    // Criando o asset a partir do módulo
    const shapeAsset = Asset.fromModule(shapeModule);
    await shapeAsset.downloadAsync();
    const shapeUri = shapeAsset.localUri || shapeAsset.uri;

    if (!shapeUri) {
      throw new Error("Não foi possível obter a URI do shape");
    }
      // Para FastGAN: enviar face, shape e color
      url = "https://api-iatos.diego-carlos.top/hair-fast-generation";
      
      const faceFile = await prepareFile(images[0], "image/jpeg", "face.jpg");
      const shapeFile = await prepareFile(shapeUri, "image/png", "shape.png");
      const colorFile = await prepareFile(images[0], "image/jpeg", "color.jpg");
      
      formData.append("face", faceFile as any);
      formData.append("shape", shapeFile as any);
      formData.append("color", colorFile as any);
    } else if (typeIa === 'bfl') {
      // Para BFL: enviar apenas um arquivo com nome 'image'
      url = "https://api-iatos.diego-carlos.top/bfl-hair";
      
      const imageFile = await prepareFile(images[0], "image/jpeg", "image.jpg");
      formData.append("image", imageFile as any);
    } else {
      throw new Error(`Tipo de IA inválido: ${typeIa}. Use 'fastgan' ou 'bfl'.`);
    }

    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer 4a81fb03-5c8b-4a59-8444-86518050f737",
        },
        body: formData,
      }
    );
    const res = await response.json();
    const finish = typeIa === 'bfl' ? {
        before: res.files.url,
        after: res.result
      } : {
        before: res.face.url,
        after: res.result.value.url
      }
    try {
      return finish;
    } catch (e) {
      throw new Error("Erro ao parsear resposta da API");
    }
  } catch (error: any) {
    console.error("Erro no envio de imagens:", error);
    throw error;
  }
};

/**
 * Simula o envio dos resultados para uma clínica.
 */
export const sendToClinic = async (data: {
  name: string;
  whatsapp: string;
  simulationResult: { before: string; after: string };
}): Promise<boolean> => {
  // Simula um tempo de processamento
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simula uma taxa de sucesso de 95%
  const isSuccess = Math.random() < 0.95;

  if (!isSuccess) {
    throw new Error("Falha ao enviar para a clínica");
  }

  return true;
};

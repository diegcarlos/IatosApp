import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import "react-native-get-random-values";

type FileInput = {
  uri: string;
  type: string;
  name: string;
};

const prepareFile = async (
  uri: string,
  type: string,
  name: string
): Promise<FileInput> => {
  try {
    if (!uri) {
      throw new Error(`URI inválida para o arquivo ${name}`);
    }
    // Caso seja data URI (base64)
    if (uri.startsWith("data:")) {
      const base64Data = uri.split(",")[1];
      const tempUri = `${FileSystem.cacheDirectory}${name}`;

      await FileSystem.writeAsStringAsync(tempUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return {
        uri: tempUri,
        type,
        name,
      };
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

/**
 * Simula o processamento de imagens pela IA para gerar o resultado do transplante capilar.
 */
export const simulateHairTransplant = async (
  images: string
): Promise<{ before: string; after: string }> => {
  try {
    const formData = new FormData();

    // Verificação do tipo de IA e preparação dos arquivos
    let url: string;

    // Para BFL: enviar apenas um arquivo com nome 'image'
    url = "https://api-iatos.diego-carlos.top/bfl-hair";

    const imageFile = await prepareFile(images, "image/jpeg", "image.jpg");
    formData.append("image", imageFile as any);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer 4a81fb03-5c8b-4a59-8444-86518050f737",
      },
      body: formData,
    });
    const res = await response.json();
    const finish = {
      before: res.files.url,
      after: res.result,
    };
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

export const simulateHairTransplantStability = async (
  image: string,
  mask: string
): Promise<{ before: string; after: string }> => {
  const formData = new FormData();

  const imageFile = await prepareFile(image, "image/jpeg", "image.jpg");
  formData.append("image", imageFile as any);

  const maskFile = await prepareFile(mask, "image/png", "mask.png");
  formData.append("mask", maskFile as any);

  const url = "https://api-iatos.diego-carlos.top/sta/edit-image";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer 4a81fb03-5c8b-4a59-8444-86518050f737",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
  }

  const res = await response.json();

  // Verificar se a resposta tem a estrutura esperada
  if (!res || !res.original || !res.image) {
    throw new Error(`Resposta da API inválida: ${JSON.stringify(res)}`);
  }

  const finish = {
    before: res.original.url,
    after: res.image.url,
  };
  return finish;
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

import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import { saveImage } from "../services/imageStorage";
import { colors } from "../theme";

export default function Capture() {
  const router = useRouter();
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<
    boolean | null
  >(null);
  const cameraRef = useRef<CameraView>(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"front" | "back">("front");

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === "web") {
          const devices = await navigator.mediaDevices?.enumerateDevices();
          const hasCamera =
            devices?.some((device) => device.kind === "videoinput") || false;
          setIsCameraAvailable(hasCamera);
          setHasGalleryPermission(true);

          if (hasCamera) {
            const cameraPermission =
              await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === "granted");
          } else {
            setHasCameraPermission(false);
          }
        } else {
          const cameraStatus = await Camera.requestCameraPermissionsAsync();
          setHasCameraPermission(cameraStatus.status === "granted");
          const galleryStatus =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          setHasGalleryPermission(galleryStatus.status === "granted");
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setHasGalleryPermission(true);
        setHasCameraPermission(false);
        setIsCameraAvailable(false);
      }
    })();
  }, []);

  const handleImageSelection = async (imageUri: string) => {
    if (!imageUri) {
      Alert.alert("Erro", "Não foi possível processar a imagem.");
      return;
    }

    try {
      setIsSaving(true);
      const savedUri = await saveImage(imageUri);

      if (!savedUri) {
        throw new Error("Falha ao salvar a imagem");
      }

      // Criando uma máscara padrão para a área do rosto
      const defaultMaskPoints = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ];

      router.push({
        pathname: "/photo-review",
        params: {
          photo: savedUri,
          maskPoints: JSON.stringify(defaultMaskPoints),
          source: "capture",
        },
      });
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      Alert.alert("Erro", "Não foi possível processar a imagem.");
    } finally {
      setIsSaving(false);
    }
  };

  const takePicture = async () => {
    if (!hasCameraPermission) {
      Alert.alert(
        "Permissão Negada",
        "É necessário permitir o acesso à câmera."
      );
      return;
    }

    if (!cameraRef.current) {
      Alert.alert("Erro", "Câmera não inicializada corretamente.");
      return;
    }

    try {
      setIsSaving(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
        exif: false,
      });

      if (!photo) {
        throw new Error("Nenhuma foto foi capturada");
      }

      if (!photo.uri) {
        throw new Error("URI da foto não disponível");
      }

      // Verifica se o arquivo existe
      const fileInfo = await FileSystem.getInfoAsync(photo.uri);
      if (!fileInfo.exists) {
        throw new Error("Arquivo da foto não foi criado");
      }

      if (fileInfo.size === 0) {
        throw new Error("Arquivo da foto está vazio");
      }

      await handleImageSelection(photo.uri);
    } catch (error: any) {
      console.error("Erro ao tirar foto:", error);
      Alert.alert(
        "Erro",
        `Não foi possível tirar a foto: ${error.message || "Erro desconhecido"}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async () => {
    if (!hasGalleryPermission) {
      Alert.alert(
        "Permissão Negada",
        "É necessário permitir o acesso à galeria."
      );
      return;
    }
    try {
      setIsSaving(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: false,
        quality: 1,
      });

      if (
        result &&
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        const selectedImage = result.assets[0];
        if (selectedImage && selectedImage.uri) {
          await handleImageSelection(selectedImage.uri);
        } else {
          throw new Error("Falha ao selecionar a imagem");
        }
      }
    } catch (error) {
      console.error("Erro ao escolher imagem:", error);
      Alert.alert("Erro", "Não foi possível escolher a imagem da galeria.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCamera = () => {
    setCameraFacing((prev) => (prev === "front" ? "back" : "front"));
  };

  if (!isCameraAvailable && Platform.OS === "web") {
    return (
      <View className="flex-1 bg-white">
        <Header title="Capturar Foto" showLogo={true} />
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
            Centralize seu rosto e tire uma foto
          </Text>
          <Text className="text-base text-gray-600 mb-8 text-center">
            Câmera não disponível ou permissão negada. Por favor, escolha
            imagens da galeria.
          </Text>
          <CustomButton
            title="ESCOLHER DA GALERIA"
            onPress={pickImage}
            icon="images"
            primary={true}
            disabled={isSaving}
          />
        </View>
      </View>
    );
  }

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-base text-gray-600">
          Solicitando permissões...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header title="Capturar Foto" showLogo={true} />
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
          Centralize seu rosto e tire uma foto
        </Text>
        {hasCameraPermission ? (
          <View style={{ flex: 1, width: "100%", borderRadius: 16, overflow: "hidden", position: "relative" }}>
            <CameraView
              style={{ width: "100%", height: "100%", flex: 1 }}
              facing={cameraFacing}
              ref={cameraRef}
            />
            <TouchableOpacity
              onPress={toggleCamera}
              className="absolute top-4 right-4 bg-white/80 p-3 rounded-full"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Ionicons
                name="camera-reverse-outline"
                size={24}
                color={colors.primary.main}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-base text-gray-600">Sem acesso à câmera</Text>
          </View>
        )}
      </View>
      <View className="p-6">
        {hasCameraPermission && (
          <CustomButton
            title="TIRAR FOTO"
            onPress={takePicture}
            icon="camera"
            primary={true}
            disabled={isSaving}
          />
        )}
        <CustomButton
          title="ESCOLHER DA GALERIA"
          onPress={pickImage}
          icon="images"
          primary={false}
          disabled={isSaving}
        />
      </View>
    </View>
  );
}

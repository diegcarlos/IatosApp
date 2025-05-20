import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PhotoCardProps {
  uri: string;
  label: string;
  onPress?: () => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  uri,
  label,
  onPress,
  onLoadStart,
  onLoadEnd,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      className="m-2 items-center"
      onPress={onPress}
      disabled={!onPress}
    >
      <Text className="text-base font-bold mb-2 text-gray-800">{label}</Text>
      <View className="w-40 h-40 rounded-lg overflow-hidden border border-gray-300">
        {uri && !imageError ? (
          <Image
            source={{ uri }}
            className="w-full h-full"
            // resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            onError={() => {
              console.error(`Erro ao carregar imagem: ${uri}`);
              setImageError(true);
            }}
          />
        ) : (
          <View className="w-full h-full bg-gray-100 items-center justify-center">
            <Ionicons name="camera-outline" size={40} color="#aaa" />
            {imageError && (
              <Text className="text-xs text-red-500 text-center mt-2 px-2">
                Erro ao carregar imagem
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PhotoCard;

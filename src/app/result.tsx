import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import { colors } from "../theme";

// Função principal do componente Result
// Recebe as imagens reais via props
export default function Result() {
  // Obtém os parâmetros da navegação
  const { beforeAfterImages } = useLocalSearchParams<{ beforeAfterImages?: string }>();
  // Faz o parse do JSON recebido via params
  const images: { before: string; after: string } = beforeAfterImages ? JSON.parse(beforeAfterImages) : { before: '', after: '' };
  
  const router = useRouter();

  const screenWidth = Dimensions.get("window").width;
  const [loadingAfter, setLoadingAfter] = useState(true);
  const [loadingBefore, setLoadingBefore] = useState(true);
  const [activeTab, setActiveTab] = useState<'individual' | 'comparison' | 'slider'>('individual');
  const [sliderPosition, setSliderPosition] = useState(screenWidth / 2);
  const rotationValue = useRef(0);
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  /**
   * Animação de entrada das imagens com efeito dramático
   */
  const fadeIn = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  };

  /**
   * Animação de rotação para o botão de modo
   */
  const animateRotation = () => {
    rotationValue.current += 1;
    Animated.timing(rotateAnim, {
      toValue: rotationValue.current,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Alterna para uma aba específica com animação
   */
  const switchToTab = (tab: 'individual' | 'comparison' | 'slider') => {
    
    
    
    // Sempre executa a animação, mesmo se for a mesma aba
    animateRotation();
    setActiveTab(tab);
    
    const tabIndex = ['individual', 'comparison', 'slider'].indexOf(tab);
    
    
    Animated.timing(slideAnim, {
      toValue: tabIndex,
      duration: 400,
      useNativeDriver: true,
    }).start();
    
    // Reinicia a animação de fade para dar feedback visual
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  /**
   * Manipula o gesto de arrastar do slider
   */
  const onPanGestureEvent = (event: any) => {
    const { translationX, absoluteX } = event.nativeEvent;
    const containerWidth = screenWidth - 40; // Largura do container considerando as margens
    const newPosition = Math.max(0, Math.min(containerWidth, absoluteX - 20)); // 20 é a margem lateral
    setSliderPosition(newPosition);
  };

  /**
   * Renderiza o slider de comparação interativo
   */
  const renderSliderComparison = () => {
    const imageHeight = screenWidth * 0.8;
    const containerWidth = screenWidth - 40;
    
    return (
      <View className="mx-5 mb-8">
        <View className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ height: imageHeight }}>
          {/* Imagem DEPOIS (fundo) */}
          <Image
            source={{ uri: images.after }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          
          {/* Imagem ANTES (com máscara) */}
          <Animated.View 
            className="absolute inset-0"
            style={{
              width: sliderPosition,
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: images.before }}
              className="w-full h-full"
              style={{ width: containerWidth }}
              resizeMode="cover"
            />
          </Animated.View>
          
          {/* Linha divisória */}
          <View 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{ left: sliderPosition - 2 }}
          />
          
          {/* Handle do slider com PanGestureHandler */}
          <PanGestureHandler
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={(event) => {
              if (event.nativeEvent.state === State.ACTIVE) {
                onPanGestureEvent(event);
              }
            }}
          >
            <Animated.View
              className="absolute top-1/2 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center"
              style={{ 
                left: sliderPosition - 24,
                transform: [{ translateY: -24 }],
              }}
            >
              <Ionicons name="swap-horizontal" size={24} color={colors.primary.main} />
            </Animated.View>
          </PanGestureHandler>
          
          {/* Área de toque para facilitar o arraste */}
          <PanGestureHandler
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={(event) => {
              if (event.nativeEvent.state === State.ACTIVE) {
                onPanGestureEvent(event);
              }
            }}
          >
            <Animated.View 
              className="absolute inset-0"
              style={{ backgroundColor: 'transparent' }}
            />
          </PanGestureHandler>
          
          {/* Labels */}
          <View className="absolute top-4 left-4 px-3 py-1 bg-black bg-opacity-70 rounded-full">
            <Text className="text-white text-xs font-bold">ANTES</Text>
          </View>
          <View className="absolute top-4 right-4 px-3 py-1 bg-black bg-opacity-70 rounded-full">
            <Text className="text-white text-xs font-bold">DEPOIS</Text>
          </View>
        </View>
        
        {/* Instruções */}
        <Text className="text-center mt-4 text-sm" style={{ color: colors.text.secondary }}>
          Arraste horizontalmente para comparar
        </Text>
      </View>
    );
  };

  /**
   * Renderiza o modo individual aprimorado
   */
  const renderIndividualMode = () => (
    <View className="px-5">
      {/* Card principal com gradiente */}
      <View className="mb-8">
        <LinearGradient
          colors={[colors.primary.main, colors.primary.dark]}
          className="p-6 rounded-3xl mb-4"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="sparkles" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Sua Nova Aparência</Text>
            <Ionicons name="sparkles" size={24} color="white" />
          </View>
        </LinearGradient>
        
        {loadingAfter && (
          <View
            className="w-full items-center justify-center rounded-3xl"
            style={{ 
              height: screenWidth * 0.9, 
              backgroundColor: colors.background.dark 
            }}
          >
            <View className="items-center">
              <Animated.View 
                style={{
                  transform: [{
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }]
                }}
              >
                <Ionicons name="refresh" size={40} color={colors.primary.main} />
              </Animated.View>
              <Text className="mt-3" style={{ color: colors.text.secondary }}>Processando sua transformação...</Text>
            </View>
          </View>
        )}
        
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { scale: pulseAnim }]
          }}
          className="rounded-3xl overflow-hidden shadow-2xl"
        >
          <Image
            source={{ uri: images.after }}
            className="w-full"
            style={{ height: screenWidth * 0.9 }}
            resizeMode="cover"
            onLoadStart={() => setLoadingAfter(true)}
            onLoadEnd={() => {
              setLoadingAfter(false);
              fadeIn();
            }}
          />
          
          {/* Overlay com gradiente */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            className="absolute bottom-0 left-0 right-0 p-6"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="checkmark-circle" size={24} color={colors.secondary.main} />
              <Text className="text-white font-bold text-xl ml-2">
                Resultado da Simulação
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Imagem original com design melhorado */}
      <View className="items-center mb-6">
        <View className="p-4 rounded-2xl" style={{ backgroundColor: colors.background.dark }}>
          <Text className="text-center font-bold mb-4" style={{ color: colors.text.primary }}>
            📸 Foto Original
          </Text>
          
          <View className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg border-2" style={{ borderColor: colors.primary.light }}>
            {loadingBefore && (
              <View className="w-full h-full items-center justify-center" style={{ backgroundColor: colors.background.paper }}>
                <Ionicons name="image-outline" size={32} color={colors.text.disabled} />
              </View>
            )}
            <Image
              source={{ uri: images.before }}
              className="w-full h-full"
              resizeMode="cover"
              onLoadStart={() => setLoadingBefore(true)}
              onLoadEnd={() => setLoadingBefore(false)}
            />
          </View>
        </View>
      </View>
    </View>
  );

  /**
   * Renderiza o modo de comparação lado a lado
   */
  const renderComparisonMode = () => (
    <Animated.View 
      style={{
        transform: [{
          translateX: slideAnim.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 0, 0]
          })
        }],
        opacity: slideAnim.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [1, 1, 1]
        })
      }}
      className="px-5"
    >
      <View className="flex-row justify-between items-start mb-6">
        {/* Antes */}
        <View className="w-[47%]">
          <LinearGradient
            colors={[colors.text.disabled, colors.text.secondary]}
            className="mb-3 py-3 px-4 rounded-2xl"
          >
            <Text className="text-center font-bold text-white">ANTES</Text>
          </LinearGradient>
          <View className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              source={{ uri: images.before }}
              style={{ width: '100%', aspectRatio: 1 }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Seta animada */}
        <View className="w-[6%] items-center justify-center" style={{ marginTop: 60 }}>
          <Animated.View
            style={{
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })
              }]
            }}
          >
          </Animated.View>
        </View>

        {/* Depois */}
        <View className="w-[47%]">
          <LinearGradient
            colors={[colors.primary.main, colors.primary.dark]}
            className="mb-3 py-3 px-4 rounded-2xl"
          >
            <Text className="text-center font-bold text-white">DEPOIS</Text>
          </LinearGradient>
          <View className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              source={{ uri: images.after }}
              style={{ width: '100%', aspectRatio: 1 }}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
      
      {/* Card de estatísticas */}
      <LinearGradient
        colors={[colors.secondary.main + '20', colors.secondary.main + '10']}
        className="p-6 rounded-2xl"
      >
        <View className="flex-row items-center justify-center mb-2">
          <Ionicons name="analytics" size={24} color={colors.secondary.main} />
          <Text className="ml-2 font-bold text-lg" style={{ color: colors.secondary.main }}>
            Análise da Transformação
          </Text>
        </View>
        <Text className="text-center" style={{ color: colors.text.secondary }}>
          Simulação gerada por Inteligência Artificial
        </Text>
      </LinearGradient>
    </Animated.View>
  );

  /**
   * Renderiza as abas de navegação criativas
   */
  const renderTabs = () => {
    const tabs = [
      { 
        id: 'individual', 
        title: 'Individual', 
        icon: 'eye-outline', 
        activeIcon: 'eye',
        description: 'Foco no resultado'
      },
      { 
        id: 'comparison', 
        title: 'Comparação', 
        icon: 'copy-outline', 
        activeIcon: 'copy',
        description: 'Lado a lado'
      },
      { 
        id: 'slider', 
        title: 'Interativo', 
        icon: 'swap-horizontal-outline', 
        activeIcon: 'swap-horizontal',
        description: 'Slider dinâmico'
      }
    ];

    return (
      <View className="mx-5 mb-6">
        <View className="flex-row bg-white rounded-2xl p-2 shadow-lg" style={{ backgroundColor: colors.background.paper }}>
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => {
                  
                  switchToTab(tab.id as 'individual' | 'comparison' | 'slider');
                }}
                activeOpacity={0.7}
                className="flex-1 items-center py-4 px-2 rounded-xl"
                style={{
                  backgroundColor: isActive ? colors.primary.main : 'transparent',
                  marginHorizontal: 2,
                  borderWidth: isActive ? 0 : 1,
                  borderColor: isActive ? 'transparent' : colors.primary.light + '30',
                }}
              >
                <Animated.View
                  style={{
                    transform: [{
                      scale: isActive ? scaleAnim : new Animated.Value(1)
                    }]
                  }}
                >
                  <Ionicons 
                    name={isActive ? tab.activeIcon as any : tab.icon as any} 
                    size={24} 
                    color={isActive ? 'white' : colors.text.secondary} 
                  />
                </Animated.View>
                <Text 
                  className="text-xs font-bold mt-2 text-center"
                  style={{ 
                    color: isActive ? 'white' : colors.text.secondary,
                    fontSize: 10
                  }}
                >
                  {tab.title}
                </Text>
                <Text 
                  className="text-xs mt-1 text-center"
                  style={{ 
                    color: isActive ? 'rgba(255,255,255,0.8)' : colors.text.disabled,
                    fontSize: 8
                  }}
                >
                  {tab.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Indicador de aba ativa com animação */}
        <Animated.View
          className="h-1 rounded-full mt-2"
          style={{
            backgroundColor: colors.primary.main,
            width: '30%',
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, (0.33 * Dimensions.get('window').width), (0.66 * Dimensions.get('window').width)]
                })
              }
            ],
            opacity: fadeAnim
          }}
        />
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background.paper }}>
      <Header title="Resultado da Simulação IA" showLogo={false} />
      <ScrollView
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
       

        {/* Sistema de Abas Criativo */}
        {renderTabs()}

        {/* Renderização condicional dos modos */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 0, 0]
              })
            }]
          }}
        >
          {activeTab === 'individual' && renderIndividualMode()}
          {activeTab === 'comparison' && renderComparisonMode()}
          {activeTab === 'slider' && renderSliderComparison()}
        </Animated.View>
      </ScrollView>

      {/* Footer com gradiente e botões aprimorados */}
      <LinearGradient
        colors={[colors.background.paper, colors.background.dark]}
        className="p-5"
      >
        <View className="border-t-2 pt-5" style={{ borderColor: colors.primary.light + '30' }}>
          <CustomButton
            title="Enviar para Clínica"
            onPress={() => {
              // Ação personalizada sem router
              
            }}
            icon="send-outline"
            primary={true}
          />
          <View className="flex-row justify-between mt-3">
            <View className="flex-1 mr-2">
              <CustomButton
                title="Nova Simulação"
                onPress={() => {
                  router.replace("/capture");
                }}
                icon="refresh-outline"
                primary={false}
              />
            </View>
            <View className="flex-1 ml-2">
              <CustomButton
                title="Ver Histórico"
                onPress={() => {
                  router.push("/history");
                }}
                icon="time-outline"
                primary={false}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

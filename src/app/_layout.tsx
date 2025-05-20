import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { paddingTop: 0 },
            // Isso garante que o conteúdo fique abaixo da barra de status
            statusBarStyle: "dark",
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="capture"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="history"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="result"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="photo-review"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="send-to-clinic"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="success"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

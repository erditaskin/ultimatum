import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GameProvider } from "../karbasan/context";
import { FeedbackLayer } from "../ui/karbasan/Feedback";
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GameProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              contentStyle: { backgroundColor: "#DAE8F1" },
            }}
          />
          <FeedbackLayer />
        </GameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

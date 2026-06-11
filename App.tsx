import "./global.css";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { ScrollProvider } from "@/contexts/ScrollContext";
import RootNavigator from "@/navigation/RootNavigator";
import AppSplash from "@/components/AppSplash";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  // Preload all icon fonts before rendering — prevents blank icons on web
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...FontAwesome5.font,
    ...Feather.font,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
        <ThemeProvider>
          <LocationProvider>
            <ScrollProvider>
              <RootNavigator />
              {!splashDone && <AppSplash onDone={() => setSplashDone(true)} />}
            </ScrollProvider>
          </LocationProvider>
        </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
});

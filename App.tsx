import "./global.css";
import React, { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { ScrollProvider } from "@/contexts/ScrollContext";
import RootNavigator from "@/navigation/RootNavigator";
import AppSplash from "@/components/AppSplash";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [ready, setReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({});

  useEffect(() => {
    // Proceed when fonts load, error, or after 3s timeout (prevents infinite spinner on Vercel)
    if (fontsLoaded || fontError) {
      setReady(true);
      return;
    }
    const t = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(t);
  }, [fontsLoaded, fontError]);

  if (!ready) {
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

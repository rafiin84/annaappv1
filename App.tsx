import "./global.css";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { ScrollProvider } from "@/contexts/ScrollContext";
import RootNavigator from "@/navigation/RootNavigator";
import AppSplash from "@/components/AppSplash";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LocationProvider>
            <ScrollProvider>
              <RootNavigator />
              {!splashDone && <AppSplash onDone={() => setSplashDone(true)} />}
            </ScrollProvider>
          </LocationProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

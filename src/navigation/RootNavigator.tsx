import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import BottomTabNavigator from "./BottomTabNavigator";
import NotificationsScreen from "@/screens/NotificationsScreen";
import LeadersScreen from "@/screens/LeadersScreen";
import VolunteerScreen from "@/screens/VolunteerScreen";
import EventsScreen from "@/screens/EventsScreen";
import LoginScreen from "@/screens/LoginScreen";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { RootStackParamList } from "@/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isDark, theme } = useTheme();
  const { isAuthenticated } = useAuth();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.surface,
      border: theme.border,
      primary: theme.primary,
      text: theme.textPrimary,
      notification: theme.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isAuthenticated ? theme.statusBar : "light"} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: "slide_from_right",
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ animation: "fade" }}
          />
        ) : (
          <>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{ animation: "slide_from_bottom" }}
            />
            <Stack.Screen name="LeaderChannel" component={LeadersScreen} />
            <Stack.Screen name="EventDetail" component={EventsScreen} />
            <Stack.Screen name="IssueReport" component={VolunteerScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

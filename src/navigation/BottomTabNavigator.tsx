import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "@/screens/HomeScreen";
import ReelsScreen from "@/screens/ReelsScreen";
import DiscoverScreen from "@/screens/DiscoverScreen";
import CommunityScreen from "@/screens/CommunityScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { useTheme } from "@/contexts/ThemeContext";
import { useScroll } from "@/contexts/ScrollContext";
import { MOCK_NOTIFICATIONS } from "@/data/mockData";
import { MainTabParamList } from "@/types";

const Tab = createBottomTabNavigator<MainTabParamList>();

const BLUE = "#2563EB";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

interface TabConfig {
  name: keyof MainTabParamList;
  icon: FeatherName;
}

const TABS: TabConfig[] = [
  { name: "Home",      icon: "home"      },
  { name: "Reels",     icon: "play"      },
  { name: "Discover",  icon: "compass"   },
  { name: "Community", icon: "map-pin"   },
  { name: "Profile",   icon: "user"      },
];

const UNREAD = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { theme, isDark } = useTheme();
  const { scrolledDown } = useScroll();
  const insets = useSafeAreaInsets();

  const pillH  = useRef(new Animated.Value(62)).current;
  const iconSc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pillH,  { toValue: scrolledDown ? 50 : 62, useNativeDriver: false, tension: 120, friction: 10 }),
      Animated.spring(iconSc, { toValue: scrolledDown ? 0.85 : 1, useNativeDriver: true,  tension: 120, friction: 10 }),
    ]).start();
  }, [scrolledDown]);

  const bg = isDark ? "rgba(18,18,24,0.98)" : "rgba(255,255,255,0.98)";

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) + 4 }]}>
      <Animated.View
        style={[
          styles.pill,
          {
            height: pillH,
            backgroundColor: bg,
            shadowColor: "#000",
            shadowOpacity: isDark ? 0.4 : 0.10,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 8 },
            elevation: 20,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = TABS.find((t) => t.name === route.name)!;
          const iconColor = isFocused ? BLUE : (isDark ? "#6B7280" : "#9CA3AF");

          const onPress = () => {
            const ev = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !ev.defaultPrevented) navigation.navigate(route.name as any);
          };

          return (
            <TouchableOpacity
              key={route.name}
              onPress={onPress}
              activeOpacity={0.75}
              style={styles.item}
            >
              <Animated.View style={{ transform: [{ scale: iconSc }] }}>
                <Feather
                  name={tab.icon}
                  size={isFocused ? 23 : 22}
                  color={iconColor}
                  strokeWidth={isFocused ? 2.5 : 1.8}
                />
              </Animated.View>

              {/* Blue dot under active icon */}
              {isFocused && <View style={styles.activeDot} />}

              {/* Notification badge on Home */}
              {route.name === "Home" && UNREAD > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{UNREAD > 9 ? "9+" : UNREAD}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
}

export default function BottomTabNavigator() {
  const SCREENS: Record<string, React.ComponentType<any>> = {
    Home: HomeScreen, Reels: ReelsScreen, Discover: DiscoverScreen,
    Community: CommunityScreen, Profile: ProfileScreen,
  };
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={SCREENS[tab.name]}
          options={{ title: tab.name }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 6,
    backgroundColor: "transparent",
  },
  pill: {
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    overflow: "visible",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
    position: "relative",
  },
  /* Small blue dot below active icon */
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: BLUE,
  },
  /* Notification badge */
  badge: {
    position: "absolute",
    top: 4,
    right: "12%" as any,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: { color: "#fff", fontSize: 8, fontWeight: "800" },
});

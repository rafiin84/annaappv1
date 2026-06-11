import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
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

const YELLOW = "#EAB308";
const BLUE   = "#2563EB";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabConfig {
  name: keyof MainTabParamList;
  icon: IoniconName;
  iconFocused: IoniconName;
}

const TABS: TabConfig[] = [
  { name: "Home",      icon: "home-outline",          iconFocused: "home" },
  { name: "Reels",     icon: "play-circle-outline",   iconFocused: "play-circle" },
  { name: "Discover",  icon: "search-outline",        iconFocused: "search" },
  { name: "Community", icon: "location-outline",      iconFocused: "location" },
  { name: "Profile",   icon: "person-circle-outline", iconFocused: "person-circle" },
];

const UNREAD = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { theme, isDark } = useTheme();
  const { scrolledDown } = useScroll();
  const insets = useSafeAreaInsets();

  const pillH  = useRef(new Animated.Value(60)).current;
  const iconSc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pillH,  { toValue: scrolledDown ? 48 : 60, useNativeDriver: false, tension: 120, friction: 10 }),
      Animated.spring(iconSc, { toValue: scrolledDown ? 0.82 : 1, useNativeDriver: true,  tension: 120, friction: 10 }),
    ]).start();
  }, [scrolledDown]);

  const bg = isDark ? "rgba(18,18,24,0.97)" : "rgba(255,255,255,0.97)";

  return (
    /* Outer container: provides bottom spacing + horizontal margin */
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, 8) + 4 },
      ]}
    >
      {/* The pill itself — normal flow, not absolute */}
      <Animated.View
        style={[
          styles.pill,
          {
            height: pillH,
            backgroundColor: bg,
            shadowColor: "#000",
            shadowOpacity: isDark ? 0.45 : 0.14,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 6 },
            elevation: 20,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = TABS.find((t) => t.name === route.name)!;
          const iconColor = isFocused ? BLUE : (isDark ? "#888" : "#9CA3AF");

          const onPress = () => {
            const ev = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !ev.defaultPrevented) navigation.navigate(route.name as any);
          };

          return (
            <TouchableOpacity
              key={route.name}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.item}
            >
              {/* Yellow highlight capsule behind active icon */}
              {isFocused && <View style={styles.activePill} />}

              <Animated.View style={{ transform: [{ scale: iconSc }], zIndex: 1 }}>
                <Ionicons
                  name={isFocused ? tab.iconFocused : tab.icon}
                  size={24}
                  color={iconColor}
                />
              </Animated.View>

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
  /* Outer wrapper — margin + bottom safe area */
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 6,
    backgroundColor: "transparent",
  },
  /* The rounded pill */
  pill: {
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 6,
    overflow: "visible",
  },
  /* Each tab item */
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    position: "relative",
  },
  /* Yellow semi-transparent capsule behind active icon */
  activePill: {
    position: "absolute",
    width: 44,
    height: 30,
    borderRadius: 15,
    backgroundColor: YELLOW + "30",
  },
  /* Notification dot */
  badge: {
    position: "absolute",
    top: 2,
    right: "10%" as any,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: YELLOW,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },
});

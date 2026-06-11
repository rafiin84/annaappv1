import React, { useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Platform, useWindowDimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  HomeIcon, FilmIcon, MagnifyingGlassIcon, MapPinIcon, UserCircleIcon,
} from "react-native-heroicons/outline";
import {
  HomeIcon as HomeIconSolid,
  FilmIcon as FilmIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  MapPinIcon as MapPinIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from "react-native-heroicons/solid";

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
const SIDEBAR_W = 72;
const DESKTOP_BREAK = 768;

interface TabConfig {
  name: keyof MainTabParamList;
  Outline: React.ComponentType<any>;
  Solid: React.ComponentType<any>;
  label: string;
}

const TABS: TabConfig[] = [
  { name: "Home",      label: "Home",     Outline: HomeIcon,              Solid: HomeIconSolid              },
  { name: "Reels",     label: "Reels",    Outline: FilmIcon,              Solid: FilmIconSolid              },
  { name: "Discover",  label: "Search",   Outline: MagnifyingGlassIcon,   Solid: MagnifyingGlassIconSolid   },
  { name: "Community", label: "Local",    Outline: MapPinIcon,            Solid: MapPinIconSolid            },
  { name: "Profile",   label: "Profile",  Outline: UserCircleIcon,        Solid: UserCircleIconSolid        },
];

const UNREAD = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
const CONTENT_MAX_W = 470;

// ── Center screen content on desktop (Instagram Web style) ───────────────────

function withDesktopCenter<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  return function DesktopCentered(props: P) {
    const { width } = useWindowDimensions();
    const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAK;
    if (!isDesktop) return <WrappedComponent {...props} />;
    return (
      <View style={centerStyles.outer}>
        <View style={centerStyles.inner}>
          <WrappedComponent {...props} />
        </View>
      </View>
    );
  };
}

const centerStyles = StyleSheet.create({
  outer: { flex: 1, alignItems: "center" },
  inner: { flex: 1, width: "100%" as any, maxWidth: CONTENT_MAX_W },
});

// ── Desktop: left sidebar (Instagram Web style) ───────────────────────────────

function DesktopSidebar({ state, navigation }: BottomTabBarProps) {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.sidebar,
        {
          backgroundColor: isDark ? "#0A0A0F" : "#ffffff",
          borderRightColor: isDark ? "rgba(255,255,255,0.08)" : "#DBDBDB",
        },
      ]}
    >
      {/* Logo */}
      <View style={styles.sidebarLogo}>
        <Text style={[styles.sidebarLogoText, { color: theme.textPrimary }]}>A</Text>
      </View>

      {/* Nav items */}
      <View style={styles.sidebarNav}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = TABS.find((t) => t.name === route.name)!;
          const IconComp = isFocused ? tab.Solid : tab.Outline;
          const iconColor = isFocused ? (isDark ? "#fff" : "#000") : (isDark ? "#6B7280" : "#737373");

          const onPress = () => {
            const ev = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !ev.defaultPrevented) navigation.navigate(route.name as any);
          };

          return (
            <TouchableOpacity
              key={route.name}
              onPress={onPress}
              style={[
                styles.sidebarItem,
                isFocused && { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F5F5F5" },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.sidebarIconWrap}>
                <IconComp color={iconColor} size={26} strokeWidth={isFocused ? 2.5 : 1.75} />
                {route.name === "Home" && UNREAD > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{UNREAD > 9 ? "9+" : UNREAD}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Mobile: floating bottom pill ─────────────────────────────────────────────

function MobileTabBar({ state, navigation }: BottomTabBarProps) {
  const { theme, isDark } = useTheme();
  const { scrolledDown } = useScroll();
  const insets = useSafeAreaInsets();

  const pillH  = useRef(new Animated.Value(64)).current;
  const iconSc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pillH,  { toValue: scrolledDown ? 52 : 64, useNativeDriver: false, tension: 120, friction: 10 }),
      Animated.spring(iconSc, { toValue: scrolledDown ? 0.85 : 1, useNativeDriver: true,  tension: 120, friction: 10 }),
    ]).start();
  }, [scrolledDown]);

  const bg = isDark ? "rgba(15,15,20,0.98)" : "rgba(255,255,255,0.98)";

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) + 4 }]}>
      <Animated.View
        style={[
          styles.pill,
          {
            height: pillH,
            backgroundColor: bg,
            shadowColor: "#000",
            shadowOpacity: isDark ? 0.4 : 0.08,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: -2 },
            elevation: 20,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = TABS.find((t) => t.name === route.name)!;
          const iconColor = isFocused ? BLUE : (isDark ? "#6B7280" : "#9CA3AF");
          const IconComp  = isFocused ? tab.Solid : tab.Outline;

          const onPress = () => {
            const ev = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !ev.defaultPrevented) navigation.navigate(route.name as any);
          };

          return (
            <TouchableOpacity key={route.name} onPress={onPress} activeOpacity={0.75} style={styles.item}>
              <Animated.View style={{ transform: [{ scale: iconSc }] }}>
                <IconComp color={iconColor} size={24} strokeWidth={isFocused ? 2 : 1.5} />
              </Animated.View>
              {isFocused && <View style={styles.activeDot} />}
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

// ── Responsive router: pick sidebar or bottom tab ────────────────────────────

function ResponsiveTabBar(props: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAK;
  return isDesktop ? <DesktopSidebar {...props} /> : <MobileTabBar {...props} />;
}

// ── Navigator ─────────────────────────────────────────────────────────────────

const RAW_SCREENS: Record<string, React.ComponentType<any>> = {
  Home: HomeScreen, Reels: ReelsScreen, Discover: DiscoverScreen,
  Community: CommunityScreen, Profile: ProfileScreen,
};

// Wrap each screen once at module level (stable reference — avoids remount on re-render)
const CENTERED_SCREENS: Record<string, React.ComponentType<any>> = Object.fromEntries(
  Object.entries(RAW_SCREENS).map(([k, v]) => [k, withDesktopCenter(v)])
);

export default function BottomTabNavigator() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAK;

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <ResponsiveTabBar {...props} />}
      sceneContainerStyle={isDesktop ? { marginLeft: SIDEBAR_W } : undefined}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={CENTERED_SCREENS[tab.name]}
          options={{ title: tab.label }}
        />
      ))}
    </Tab.Navigator>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Desktop sidebar
  sidebar: {
    width: SIDEBAR_W,
    height: "100%" as any,
    borderRightWidth: 1,
    paddingVertical: 16,
    alignItems: "center",
    // Fixed to left on web
    ...(Platform.OS === "web" ? {
      position: "fixed" as any,
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
    } : {}),
  },
  sidebarLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  sidebarLogoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
  },
  sidebarNav: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  sidebarItem: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarIconWrap: {
    position: "relative",
  },

  // Mobile bottom pill
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
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: BLUE,
  },

  // Shared badge
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
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

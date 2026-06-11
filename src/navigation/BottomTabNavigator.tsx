import React, { useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Image,
  Platform, useWindowDimensions, ScrollView,
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
const CONTENT_MAX_W = 470;
const RIGHT_PANEL_W = 280;
const PANEL_GAP = 48;

// Sidebar and right-panel left positions relative to viewport width
function useDesktopPositions(vw: number) {
  const isDesktop = Platform.OS === "web" && vw >= DESKTOP_BREAK;
  const contentLeft = (vw - CONTENT_MAX_W) / 2;
  const sidebarLeft = Math.max(0, contentLeft - SIDEBAR_W - PANEL_GAP);
  const rightPanelLeft = (vw + CONTENT_MAX_W) / 2 + PANEL_GAP;
  const showRightPanel = isDesktop && rightPanelLeft + RIGHT_PANEL_W <= vw - 8;
  return { isDesktop, sidebarLeft, rightPanelLeft, showRightPanel };
}

interface TabConfig {
  name: keyof MainTabParamList;
  Outline: React.ComponentType<any>;
  Solid: React.ComponentType<any>;
  label: string;
}

const TABS: TabConfig[] = [
  { name: "Home",      label: "Home",    Outline: HomeIcon,            Solid: HomeIconSolid            },
  { name: "Reels",     label: "Reels",   Outline: FilmIcon,            Solid: FilmIconSolid            },
  { name: "Discover",  label: "Search",  Outline: MagnifyingGlassIcon, Solid: MagnifyingGlassIconSolid },
  { name: "Community", label: "Local",   Outline: MapPinIcon,          Solid: MapPinIconSolid          },
  { name: "Profile",   label: "Profile", Outline: UserCircleIcon,      Solid: UserCircleIconSolid      },
];

const UNREAD = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

// ─── Recent Followers data ────────────────────────────────────────────────────

const RECENT_FOLLOWERS = [
  { id: "rf1", name: "Karthik Murugesan", handle: "karthik_cbe", avatar: "https://randomuser.me/api/portraits/men/72.jpg",  followedBy: "Priya Raj" },
  { id: "rf2", name: "Divya Subramaniam", handle: "divya_tn",    avatar: "https://randomuser.me/api/portraits/women/44.jpg", followedBy: "Murugan K" },
  { id: "rf3", name: "Rajan Pillai",      handle: "rajan_mdurai",avatar: "https://randomuser.me/api/portraits/men/68.jpg",  followedBy: "Lakshmi V" },
  { id: "rf4", name: "Meena Krishnan",    handle: "meena_k",     avatar: "https://randomuser.me/api/portraits/women/42.jpg", followedBy: "Arjun S" },
  { id: "rf5", name: "Senthil Kumar",     handle: "senthil_tn",  avatar: "https://randomuser.me/api/portraits/men/58.jpg",  followedBy: "Deepa M" },
  { id: "rf6", name: "Anitha Selvam",     handle: "anitha_s",    avatar: "https://randomuser.me/api/portraits/women/59.jpg", followedBy: "Shankar Rajan" },
];

// ─── Center content on desktop ────────────────────────────────────────────────

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

// ─── Desktop left sidebar ─────────────────────────────────────────────────────

function DesktopSidebar({ state, navigation, leftPos, isDark, theme }: BottomTabBarProps & {
  leftPos: number; isDark: boolean; theme: any;
}) {
  return (
    <View
      style={[
        styles.sidebar,
        {
          left: leftPos,
          backgroundColor: isDark ? "#0A0A0F" : "#ffffff",
          borderRightColor: isDark ? "rgba(255,255,255,0.08)" : "#DBDBDB",
        },
      ]}
    >
      <View style={styles.sidebarLogo}>
        <Text style={styles.sidebarLogoText}>A</Text>
      </View>

      <View style={styles.sidebarNav}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = TABS.find((t) => t.name === route.name)!;
          const IconComp = isFocused ? tab.Solid : tab.Outline;
          const iconColor = isFocused
            ? (isDark ? "#fff" : "#000")
            : (isDark ? "#6B7280" : "#737373");

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

// ─── Desktop right panel ──────────────────────────────────────────────────────

function DesktopRightPanel({ leftPos, isDark, theme }: { leftPos: number; isDark: boolean; theme: any }) {
  return (
    <View
      style={[
        styles.rightPanel,
        {
          left: leftPos,
          backgroundColor: isDark ? "#0A0A0F" : "transparent",
        },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recent Followers */}
        <View style={styles.rpSection}>
          <Text style={[styles.rpTitle, { color: theme.textSecondary }]}>Recent followers</Text>
          {RECENT_FOLLOWERS.map((f) => (
            <TouchableOpacity key={f.id} style={styles.followerRow} activeOpacity={0.75}>
              <Image source={{ uri: f.avatar }} style={styles.followerAvatar} />
              <View style={styles.followerInfo}>
                <Text style={[styles.followerName, { color: theme.textPrimary }]} numberOfLines={1}>
                  {f.name}
                </Text>
                <Text style={[styles.followerSub, { color: theme.textSecondary }]} numberOfLines={1}>
                  Followed by {f.followedBy}
                </Text>
              </View>
              <TouchableOpacity style={[styles.followBtn, { borderColor: isDark ? "#374151" : "#D1D5DB" }]}>
                <Text style={[styles.followBtnText, { color: theme.textPrimary }]}>Follow</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Suggested hashtags */}
        <View style={[styles.rpSection, styles.rpSectionTop]}>
          <Text style={[styles.rpTitle, { color: theme.textSecondary }]}>Trending in Tamil Nadu</Text>
          {["#WeTheLeaders", "#NammaTamilNadu", "#CoimbatoreNorth", "#EnMannEnMakkal", "#GoodPolitics"].map((tag) => (
            <TouchableOpacity key={tag} style={styles.hashtagRow} activeOpacity={0.75}>
              <Text style={[styles.hashtagText, { color: theme.primary }]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.rpFooter, { color: theme.textTertiary }]}>
          Anna · We The Leaders · Tamil Nadu
        </Text>
      </ScrollView>
    </View>
  );
}

// ─── Mobile bottom pill ───────────────────────────────────────────────────────

function MobileTabBar({ state, navigation }: BottomTabBarProps) {
  const { theme, isDark } = useTheme();
  const { scrolledDown } = useScroll();
  const insets = useSafeAreaInsets();

  const pillH  = useRef(new Animated.Value(64)).current;
  const iconSc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pillH,  { toValue: scrolledDown ? 52 : 64, useNativeDriver: false, tension: 120, friction: 10 }),
      Animated.spring(iconSc, { toValue: scrolledDown ? 0.85 : 1, useNativeDriver: true, tension: 120, friction: 10 }),
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
          const iconColor  = isFocused ? BLUE : (isDark ? "#6B7280" : "#9CA3AF");
          const IconComp   = isFocused ? tab.Solid : tab.Outline;

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

// ─── Responsive tab bar ───────────────────────────────────────────────────────

function ResponsiveTabBar(props: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const { theme, isDark } = useTheme();
  const { isDesktop, sidebarLeft } = useDesktopPositions(width);
  if (!isDesktop) return <MobileTabBar {...props} />;
  return <DesktopSidebar {...props} leftPos={sidebarLeft} isDark={isDark} theme={theme} />;
}

// ─── Screens (module-level — stable reference) ───────────────────────────────

const RAW_SCREENS: Record<string, React.ComponentType<any>> = {
  Home: HomeScreen, Reels: ReelsScreen, Discover: DiscoverScreen,
  Community: CommunityScreen, Profile: ProfileScreen,
};

const CENTERED_SCREENS: Record<string, React.ComponentType<any>> = Object.fromEntries(
  Object.entries(RAW_SCREENS).map(([k, v]) => [k, withDesktopCenter(v)])
);

// ─── Navigator ────────────────────────────────────────────────────────────────

export default function BottomTabNavigator() {
  const { width } = useWindowDimensions();
  const { theme, isDark } = useTheme();
  const { showRightPanel, rightPanelLeft } = useDesktopPositions(width);

  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <ResponsiveTabBar {...props} />}
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

      {showRightPanel && (
        <DesktopRightPanel leftPos={rightPanelLeft} isDark={isDark} theme={theme} />
      )}
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Desktop sidebar — left is set dynamically via inline style
  sidebar: {
    width: SIDEBAR_W,
    borderRightWidth: 1,
    paddingVertical: 16,
    alignItems: "center",
    ...(Platform.OS === "web" ? {
      position: "fixed" as any,
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
  sidebarLogoText: { fontSize: 22, fontWeight: "900", color: "#fff" },
  sidebarNav: { flex: 1, alignItems: "center", gap: 4 },
  sidebarItem: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarIconWrap: { position: "relative" },

  // Desktop right panel — left is set dynamically
  rightPanel: {
    width: RIGHT_PANEL_W,
    paddingTop: 24,
    paddingHorizontal: 8,
    ...(Platform.OS === "web" ? {
      position: "fixed" as any,
      top: 0,
      bottom: 0,
      zIndex: 100,
      overflowY: "auto" as any,
    } : {}),
  },
  rpSection: { marginBottom: 8 },
  rpSectionTop: { marginTop: 20, paddingTop: 20, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#E5E7EB" },
  rpTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  followerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  followerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
  },
  followerInfo: { flex: 1 },
  followerName: { fontSize: 13, fontWeight: "600" },
  followerSub: { fontSize: 12, marginTop: 1 },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  followBtnText: { fontSize: 12, fontWeight: "600" },
  hashtagRow: { paddingVertical: 6 },
  hashtagText: { fontSize: 13, fontWeight: "600" },
  rpFooter: { fontSize: 11, marginTop: 24, lineHeight: 18 },

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

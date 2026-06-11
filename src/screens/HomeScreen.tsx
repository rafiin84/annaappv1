import React, { useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "@/contexts/LocationContext";
import { useScroll } from "@/contexts/ScrollContext";
import StoryBar from "@/components/StoryBar";
import FeedPost from "@/components/FeedPost";
import EventCard from "@/components/EventCard";
import { MOCK_POSTS, MOCK_STORIES, MOCK_EVENTS, MOCK_NOTIFICATIONS } from "@/data/mockData";

type FeedItem =
  | { type: "stories" }
  | { type: "post"; data: (typeof MOCK_POSTS)[0] }
  | { type: "event_inline"; data: (typeof MOCK_EVENTS)[0] }
  | { type: "section_header"; title: string; subtitle?: string }
  | { type: "leader_cta" };

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const { location } = useLocation();
  const { setScrolledDown } = useScroll();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const lastScrollY = useRef(0);

  const onScroll = useCallback((e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    setScrolledDown(y > lastScrollY.current && y > 60);
    lastScrollY.current = y;
  }, []);

  const feedItems: FeedItem[] = [
    { type: "stories" },
    { type: "section_header", title: `🏘️ ${location.constituency}`, subtitle: "Happening near you" },
    { type: "post", data: MOCK_POSTS[1] },
    { type: "post", data: MOCK_POSTS[2] },
    { type: "event_inline", data: MOCK_EVENTS[0] },
    { type: "post", data: MOCK_POSTS[5] },
    { type: "section_header", title: `🌆 ${location.district} District` },
    { type: "post", data: MOCK_POSTS[3] },
    { type: "post", data: MOCK_POSTS[4] },
    { type: "event_inline", data: MOCK_EVENTS[1] },
    { type: "leader_cta" },
    { type: "section_header", title: "📣 State Updates" },
    { type: "post", data: MOCK_POSTS[0] },
    { type: "post", data: MOCK_POSTS[6] },
    { type: "post", data: MOCK_POSTS[7] },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => {
      if (item.type === "stories") {
        return (
          <StoryBar
            stories={MOCK_STORIES}
            onStoryPress={() => {}}
            onAddStory={() => {}}
          />
        );
      }
      if (item.type === "section_header") {
        return (
          <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
            <View style={styles.sectionAccent} />
            <View>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              {item.subtitle && (
                <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>{item.subtitle}</Text>
              )}
            </View>
          </View>
        );
      }
      if (item.type === "post") {
        return <FeedPost post={item.data} />;
      }
      if (item.type === "event_inline") {
        return (
          <View style={styles.eventInline}>
            <View style={styles.eventInlineLabel}>
              <Ionicons name="calendar" size={12} color={theme.primary} />
              <Text style={[styles.eventInlineLabelText, { color: theme.primary }]}>Event near you</Text>
            </View>
            <EventCard event={item.data} compact />
          </View>
        );
      }
      if (item.type === "leader_cta") {
        return <LeaderCTA theme={theme} />;
      }
      return null;
    },
    [theme]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ── Top header: [+]  Anna  [☰] ── */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="add-circle-outline" size={26} color={theme.primary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Anna</Text>

        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={26} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── Feed ── */}
      <FlatList
        data={feedItems}
        keyExtractor={(item, index) => {
          if (item.type === "post") return `post-${item.data.id}`;
          if (item.type === "event_inline") return `event-${item.data.id}`;
          return `${item.type}-${index}`;
        }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        removeClippedSubviews
        maxToRenderPerBatch={8}
        windowSize={10}
      />
    </View>
  );
}

function LeaderCTA({ theme }: { theme: any }) {
  return (
    <View style={[styles.leaderCTA, { backgroundColor: theme.primary + "12", borderColor: theme.primary + "30" }]}>
      <View style={styles.leaderCTAIcon}>
        <Ionicons name="megaphone" size={24} color={theme.primary} />
      </View>
      <View style={styles.leaderCTAContent}>
        <Text style={[styles.leaderCTATitle, { color: theme.textPrimary }]}>Follow your leaders</Text>
        <Text style={[styles.leaderCTASub, { color: theme.textSecondary }]}>
          Get direct updates from Annamalai and your local leaders
        </Text>
      </View>
      <TouchableOpacity style={[styles.leaderCTABtn, { backgroundColor: theme.primary }]}>
        <Text style={styles.leaderCTABtnText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  /* Feed sections */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#EAB308",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  sectionSub: { fontSize: 12, marginTop: 2 },

  eventInline: { marginTop: 4 },
  eventInlineLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  eventInlineLabelText: { fontSize: 11, fontWeight: "600" },

  leaderCTA: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leaderCTAIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(37,99,235,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  leaderCTAContent: { flex: 1 },
  leaderCTATitle: { fontSize: 14, fontWeight: "700" },
  leaderCTASub: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  leaderCTABtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  leaderCTABtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
});

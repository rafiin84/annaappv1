import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "@/contexts/LocationContext";
import LocationHeader from "@/components/LocationHeader";
import { MOCK_COMMUNITIES, MOCK_LEADERS, MOCK_NOTIFICATIONS, formatCount, formatTimeAgo } from "@/data/mockData";
import { Community } from "@/types";
import { palette } from "@/theme/colors";

const TABS = ["My Area", "District", "State", "Leaders"] as const;
type Tab = (typeof TABS)[number];

export default function CommunityScreen() {
  const { theme } = useTheme();
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("My Area");
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Location Header with picker */}
      <LocationHeader unreadCount={unread} />

      {/* Tab bar */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomWidth: 2.5, borderBottomColor: theme.primary },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? theme.primary : theme.textSecondary },
                activeTab === tab && { fontWeight: "700" },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {activeTab === "My Area" && <MyAreaTab theme={theme} location={location} />}
        {activeTab === "District" && <DistrictTab theme={theme} location={location} />}
        {activeTab === "State" && <StateTab theme={theme} />}
        {activeTab === "Leaders" && <LeadersTab theme={theme} />}
      </ScrollView>
    </View>
  );
}

function MyAreaTab({ theme, location }: { theme: any; location: any }) {
  const community = MOCK_COMMUNITIES[0];
  return (
    <View>
      {/* Featured community card */}
      <CommunityHeroCard community={community} theme={theme} />

      {/* Live activity */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          🔴 Live Activity in {location.constituency}
        </Text>
        <View style={[styles.activityCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.activityRow}>
            <View style={[styles.activeDot, { backgroundColor: "#22C55E" }]} />
            <Text style={[styles.activityText, { color: theme.textSecondary }]}>
              <Text style={{ fontWeight: "700", color: theme.textPrimary }}>892 members </Text>
              active now in your constituency
            </Text>
          </View>
          <View style={styles.activityRow}>
            <Ionicons name="chatbubble" size={14} color={theme.textTertiary} />
            <Text style={[styles.activityText, { color: theme.textSecondary }]}>
              <Text style={{ fontWeight: "700", color: theme.textPrimary }}>47 posts </Text>
              today
            </Text>
          </View>
          <View style={styles.activityRow}>
            <Ionicons name="trending-up" size={14} color={theme.primary} />
            <Text style={[styles.activityText, { color: theme.textSecondary }]}>
              <Text style={{ fontWeight: "700", color: theme.primary }}>+23% </Text>
              engagement this week
            </Text>
          </View>
        </View>
      </View>

      {/* Recent discussions */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recent Discussions</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        {community.recentPosts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={[styles.discussionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <View style={[styles.discussionIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="chatbubbles" size={18} color={theme.primary} />
            </View>
            <View style={styles.discussionContent}>
              <Text style={[styles.discussionText, { color: theme.textPrimary }]} numberOfLines={2}>
                {post.content}
              </Text>
              <Text style={[styles.discussionTime, { color: theme.textTertiary }]}>
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function DistrictTab({ theme, location }: { theme: any; location: any }) {
  const districtCommunities = MOCK_COMMUNITIES.filter((c) => c.level === "district");
  return (
    <View style={{ paddingTop: 16 }}>
      {districtCommunities.map((c) => (
        <CommunityListCard key={c.id} community={c} theme={theme} />
      ))}
      <View style={[styles.suggestCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={[styles.suggestIconBg, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="sparkles" size={22} color={theme.primary} />
        </View>
        <Text style={[styles.suggestTitle, { color: theme.textPrimary }]}>Join Coimbatore Youth Network</Text>
        <Text style={[styles.suggestSub, { color: theme.textSecondary }]}>
          18,400 young volunteers. Join the most active youth community in the district.
        </Text>
        <TouchableOpacity style={[styles.joinBtn, { backgroundColor: theme.primary }]}>
          <Text style={styles.joinBtnText}>Join Community</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StateTab({ theme }: { theme: any }) {
  const stateCommunity = MOCK_COMMUNITIES.find((c) => c.level === "state")!;
  return (
    <View>
      <CommunityHeroCard community={stateCommunity} theme={theme} large />
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>State-wide Campaigns</Text>
        {["Mission 1 Crore Volunteers", "Clean Constituency Drive", "Voter Registration 2024"].map((camp) => (
          <TouchableOpacity
            key={camp}
            style={[styles.campaignRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <View style={[styles.campaignDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.campaignRowText, { color: theme.textPrimary }]}>{camp}</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function LeadersTab({ theme }: { theme: any }) {
  return (
    <View style={{ paddingTop: 16 }}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary, paddingHorizontal: 16, marginBottom: 12 }]}>
        Leader Channels
      </Text>
      {MOCK_LEADERS.map((leader) => (
        <TouchableOpacity
          key={leader.id}
          style={[styles.leaderRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        >
          <View style={styles.leaderAvatarWrapper}>
            <Image source={{ uri: leader.user.avatar }} style={styles.leaderAvatar} />
            {leader.channelActive && (
              <View style={[styles.activeDotAbsolute, { backgroundColor: "#22C55E" }]} />
            )}
          </View>
          <View style={styles.leaderInfo}>
            <View style={styles.leaderNameRow}>
              <Text style={[styles.leaderName, { color: theme.textPrimary }]}>{leader.user.name}</Text>
              <Ionicons name="checkmark-circle" size={15} color={theme.primary} />
            </View>
            <Text style={[styles.leaderTitle, { color: theme.textSecondary }]}>{leader.title}</Text>
            {leader.recentMessage && (
              <Text style={[styles.leaderLastMsg, { color: theme.textTertiary }]} numberOfLines={1}>
                {leader.recentMessage}
              </Text>
            )}
          </View>
          <View style={styles.leaderRight}>
            <Text style={[styles.leaderTime, { color: theme.textTertiary }]}>
              {leader.recentMessageTime ? formatTimeAgo(leader.recentMessageTime) : ""}
            </Text>
            <View style={[styles.newBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.newBadgeText}>1</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function CommunityHeroCard({ community, theme, large = false }: { community: Community; theme: any; large?: boolean }) {
  const [joined, setJoined] = useState(community.isJoined);
  return (
    <View style={[styles.heroCard, { height: large ? 220 : 180 }]}>
      <Image source={{ uri: community.coverImage }} style={styles.heroBg} resizeMode="cover" />
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={StyleSheet.absoluteFill} />
      <View style={styles.heroContent}>
        <Text style={styles.heroIcon}>{community.icon}</Text>
        <Text style={styles.heroName}>{community.name}</Text>
        <View style={styles.heroMeta}>
          <Text style={styles.heroMetaText}>{formatCount(community.stats.members)} members</Text>
          <View style={[styles.activeDot, { backgroundColor: "#22C55E" }]} />
          <Text style={styles.heroMetaText}>{formatCount(community.stats.activeToday)} active today</Text>
        </View>
        <TouchableOpacity
          onPress={() => setJoined((v) => !v)}
          style={[styles.heroJoinBtn, { backgroundColor: joined ? "rgba(255,255,255,0.2)" : theme.primary }]}
        >
          <Text style={styles.heroJoinText}>{joined ? "✓ Joined" : "Join Community"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CommunityListCard({ community, theme }: { community: Community; theme: any }) {
  const [joined, setJoined] = useState(community.isJoined);
  return (
    <View style={[styles.listCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Image source={{ uri: community.coverImage }} style={styles.listCover} resizeMode="cover" />
      <View style={styles.listBody}>
        <View style={styles.listHeader}>
          <Text style={styles.listIcon}>{community.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.listName, { color: theme.textPrimary }]}>{community.name}</Text>
            <Text style={[styles.listMeta, { color: theme.textTertiary }]}>
              {formatCount(community.stats.members)} members
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setJoined((v) => !v)}
            style={[
              styles.listJoinBtn,
              joined
                ? { backgroundColor: "transparent", borderColor: theme.border, borderWidth: 1 }
                : { backgroundColor: theme.primary },
            ]}
          >
            <Text style={[styles.listJoinText, { color: joined ? theme.textSecondary : "#fff" }]}>
              {joined ? "Joined" : "Join"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.listDesc, { color: theme.textSecondary }]} numberOfLines={2}>
          {community.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2.5,
    borderBottomColor: "transparent",
  },
  tabText: { fontSize: 13, fontWeight: "500" },
  heroCard: { position: "relative", marginHorizontal: 16, marginTop: 16, borderRadius: 20, overflow: "hidden" },
  heroBg: { ...StyleSheet.absoluteFillObject },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  heroIcon: { fontSize: 28, marginBottom: 4 },
  heroName: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 4 },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  heroMetaText: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  heroJoinBtn: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  heroJoinText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  section: { paddingTop: 20 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: "700", paddingHorizontal: 16, marginBottom: 10 },
  seeAll: { fontSize: 13, fontWeight: "600" },
  activityCard: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  activityRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  activityText: { fontSize: 13 },
  discussionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  discussionIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  discussionContent: { flex: 1 },
  discussionText: { fontSize: 13, lineHeight: 18 },
  discussionTime: { fontSize: 11, marginTop: 3 },
  listCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  listCover: { width: "100%", height: 80 },
  listBody: { padding: 12, gap: 6 },
  listHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  listIcon: { fontSize: 20 },
  listName: { fontSize: 14, fontWeight: "700" },
  listMeta: { fontSize: 11, marginTop: 1 },
  listJoinBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  listJoinText: { fontSize: 12, fontWeight: "700" },
  listDesc: { fontSize: 12, lineHeight: 17 },
  suggestCard: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  suggestIconBg: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  suggestTitle: { fontSize: 15, fontWeight: "700", textAlign: "center" },
  suggestSub: { fontSize: 13, textAlign: "center", lineHeight: 18 },
  joinBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12, marginTop: 4 },
  joinBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  campaignRow: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  campaignDot: { width: 8, height: 8, borderRadius: 4 },
  campaignRowText: { flex: 1, fontSize: 13, fontWeight: "500" },
  leaderRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 14, borderWidth: 1, gap: 12 },
  leaderAvatarWrapper: { position: "relative" },
  leaderAvatar: { width: 50, height: 50, borderRadius: 25 },
  activeDotAbsolute: { position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: "#fff" },
  leaderInfo: { flex: 1 },
  leaderNameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  leaderName: { fontSize: 15, fontWeight: "700" },
  leaderTitle: { fontSize: 11, marginTop: 2 },
  leaderLastMsg: { fontSize: 12, marginTop: 4 },
  leaderRight: { alignItems: "flex-end", gap: 6 },
  leaderTime: { fontSize: 11 },
  newBadge: { width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  newBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});

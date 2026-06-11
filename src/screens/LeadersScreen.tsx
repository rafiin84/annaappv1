import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { MOCK_LEADERS, MOCK_POSTS, formatCount, formatTimeAgo } from "@/data/mockData";
import { Leader } from "@/types";
import { palette } from "@/theme/colors";

export default function LeadersScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeLeader, setActiveLeader] = useState<Leader>(MOCK_LEADERS[0]);
  const [message, setMessage] = useState("");

  const leaderPosts = MOCK_POSTS.filter((p) => p.author.isLeader).slice(0, 4);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: insets.top + 8 }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Leader Channels</Text>
        <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
          Direct updates from your leaders
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Featured leader banner */}
        <LeaderBanner leader={MOCK_LEADERS[0]} theme={theme} />

        {/* All leader channels */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Your Leaders</Text>
          {MOCK_LEADERS.map((leader) => (
            <LeaderChannelCard
              key={leader.id}
              leader={leader}
              theme={theme}
              isActive={activeLeader.id === leader.id}
              onPress={() => setActiveLeader(leader)}
            />
          ))}
        </View>

        {/* Recent messages from active leader */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              💬 From {activeLeader.user.name.split(" ")[0]}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Chat-style messages */}
          <View style={[styles.chatContainer, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {leaderPosts.slice(0, 3).map((post) => (
              <View key={post.id} style={styles.chatMessage}>
                <Image source={{ uri: post.author.avatar }} style={styles.chatAvatar} />
                <View style={[styles.chatBubble, { backgroundColor: theme.surfaceSecondary }]}>
                  <Text style={[styles.chatText, { color: theme.textPrimary }]} numberOfLines={3}>
                    {post.content.slice(0, 120)}{post.content.length > 120 ? "..." : ""}
                  </Text>
                  <View style={styles.chatMeta}>
                    <Text style={[styles.chatTime, { color: theme.textTertiary }]}>
                      {formatTimeAgo(post.createdAt)}
                    </Text>
                    <Text style={[styles.chatReach, { color: theme.textTertiary }]}>
                      👁 {formatCount(post.stats.views)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Reply input (read-only channel feel) */}
            <View style={[styles.replyBar, { borderTopColor: theme.divider, backgroundColor: theme.surface }]}>
              <TextInput
                style={[styles.replyInput, { color: theme.textPrimary, backgroundColor: theme.surfaceSecondary }]}
                placeholder="React to this message..."
                placeholderTextColor={theme.textTertiary}
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={[styles.sendBtn, { backgroundColor: message.trim() ? theme.primary : theme.border }]}>
                <Ionicons name="send" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.statsTitle, { color: theme.textPrimary }]}>Movement Numbers</Text>
          <View style={styles.statsGrid}>
            {[
              { label: "State Volunteers", value: "78L+", icon: "people", color: "#3B82F6" },
              { label: "Active Constituencies", value: "234", icon: "location", color: palette.saffron[500] },
              { label: "Events This Month", value: "1,240", icon: "calendar", color: "#22C55E" },
              { label: "Issues Resolved", value: "8,400", icon: "checkmark-circle", color: palette.gold[500] },
            ].map((stat) => (
              <View key={stat.label} style={[styles.statItem, { backgroundColor: stat.color + "12" }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.textTertiary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function LeaderBanner({ leader, theme }: { leader: Leader; theme: any }) {
  const [following, setFollowing] = useState(leader.isFollowing);
  return (
    <View style={styles.bannerContainer}>
      <LinearGradient
        colors={[palette.navy[700], palette.navy[500], palette.saffron[700]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.bannerContent}>
          <Image source={{ uri: leader.user.avatar }} style={styles.bannerAvatar} />
          <View style={styles.bannerInfo}>
            <View style={styles.bannerNameRow}>
              <Text style={styles.bannerName}>{leader.user.name}</Text>
              <Ionicons name="checkmark-circle" size={18} color={palette.gold[400]} />
            </View>
            <Text style={styles.bannerTitle}>{leader.title}</Text>
            <View style={styles.bannerStats}>
              <Text style={styles.bannerStat}>{formatCount(leader.followers)} followers</Text>
              <View style={[styles.activeDot, { backgroundColor: leader.channelActive ? "#22C55E" : "#999" }]} />
              <Text style={styles.bannerStat}>{leader.channelActive ? "Active now" : "Offline"}</Text>
            </View>
          </View>
        </View>

        {leader.recentMessage && (
          <View style={styles.bannerMessage}>
            <Ionicons name="chatbubble" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.bannerMessageText} numberOfLines={2}>{leader.recentMessage}</Text>
          </View>
        )}

        <View style={styles.bannerActions}>
          <TouchableOpacity
            onPress={() => setFollowing((v) => !v)}
            style={[
              styles.bannerFollowBtn,
              { backgroundColor: following ? "rgba(255,255,255,0.15)" : "#fff" },
            ]}
          >
            <Text style={[styles.bannerFollowText, { color: following ? "#fff" : palette.navy[700] }]}>
              {following ? "✓ Following" : "Follow"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bannerShareBtn}>
            <Ionicons name="notifications-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

function LeaderChannelCard({
  leader, theme, isActive, onPress,
}: { leader: Leader; theme: any; isActive: boolean; onPress: () => void }) {
  const [following, setFollowing] = useState(leader.isFollowing);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.leaderCard,
        {
          backgroundColor: isActive ? theme.primaryLight : theme.card,
          borderColor: isActive ? theme.primary : theme.cardBorder,
        },
      ]}
    >
      <View style={styles.leaderCardAvatarWrapper}>
        <Image source={{ uri: leader.user.avatar }} style={styles.leaderCardAvatar} />
        {leader.channelActive && (
          <View style={[styles.onlineDot, { backgroundColor: "#22C55E" }]} />
        )}
      </View>

      <View style={styles.leaderCardInfo}>
        <View style={styles.leaderCardNameRow}>
          <Text style={[styles.leaderCardName, { color: theme.textPrimary }]}>{leader.user.name}</Text>
          <Ionicons name="checkmark-circle" size={14} color={theme.primary} />
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor(leader.priority) + "20" }]}>
            <Text style={[styles.priorityText, { color: priorityColor(leader.priority) }]}>
              {leader.priority}
            </Text>
          </View>
        </View>
        <Text style={[styles.leaderCardTitle, { color: theme.textSecondary }]} numberOfLines={1}>
          {leader.title}
        </Text>
        {leader.recentMessage && (
          <Text style={[styles.leaderCardPreview, { color: theme.textTertiary }]} numberOfLines={1}>
            {leader.recentMessage}
          </Text>
        )}
      </View>

      <View style={styles.leaderCardRight}>
        <Text style={[styles.leaderCardTime, { color: theme.textTertiary }]}>
          {leader.recentMessageTime ? formatTimeAgo(leader.recentMessageTime) : ""}
        </Text>
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); setFollowing((v) => !v); }}
          style={[
            styles.miniFollowBtn,
            following
              ? { backgroundColor: "transparent", borderColor: theme.border, borderWidth: 1 }
              : { backgroundColor: theme.primary },
          ]}
        >
          <Text style={[styles.miniFollowText, { color: following ? theme.textSecondary : "#fff" }]}>
            {following ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function priorityColor(priority: string) {
  const map: Record<string, string> = {
    national: "#EF4444",
    state: palette.saffron[500],
    district: "#3B82F6",
    constituency: "#22C55E",
  };
  return map[priority] ?? "#999";
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  headerSub: { fontSize: 12, marginTop: 2 },
  bannerContainer: { margin: 16, borderRadius: 20, overflow: "hidden" },
  banner: { padding: 16, gap: 12 },
  bannerContent: { flexDirection: "row", gap: 12, alignItems: "center" },
  bannerAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2.5, borderColor: "rgba(255,255,255,0.5)" },
  bannerInfo: { flex: 1, gap: 3 },
  bannerNameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  bannerName: { color: "#fff", fontSize: 17, fontWeight: "800" },
  bannerTitle: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  bannerStats: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  bannerStat: { color: "rgba(255,255,255,0.75)", fontSize: 11 },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  bannerMessage: {
    flexDirection: "row",
    gap: 6,
    alignItems: "flex-start",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 10,
    borderRadius: 10,
  },
  bannerMessageText: { flex: 1, color: "rgba(255,255,255,0.9)", fontSize: 12, lineHeight: 17 },
  bannerActions: { flexDirection: "row", gap: 10, alignItems: "center" },
  bannerFollowBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: "center" },
  bannerFollowText: { fontSize: 14, fontWeight: "700" },
  bannerShareBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  section: { paddingTop: 8 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: "700", paddingHorizontal: 16, marginBottom: 10 },
  seeAll: { fontSize: 13, fontWeight: "600" },
  leaderCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 10,
    alignItems: "center",
  },
  leaderCardAvatarWrapper: { position: "relative" },
  leaderCardAvatar: { width: 48, height: 48, borderRadius: 24 },
  onlineDot: { position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: 6, borderWidth: 2, borderColor: "#fff" },
  leaderCardInfo: { flex: 1 },
  leaderCardNameRow: { flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap" },
  leaderCardName: { fontSize: 14, fontWeight: "700" },
  priorityBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 5 },
  priorityText: { fontSize: 9, fontWeight: "700", textTransform: "capitalize" },
  leaderCardTitle: { fontSize: 11, marginTop: 2 },
  leaderCardPreview: { fontSize: 11, marginTop: 3 },
  leaderCardRight: { alignItems: "flex-end", gap: 6 },
  leaderCardTime: { fontSize: 10 },
  miniFollowBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  miniFollowText: { fontSize: 11, fontWeight: "700" },
  chatContainer: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  chatMessage: { flexDirection: "row", gap: 10, padding: 12, alignItems: "flex-start" },
  chatAvatar: { width: 36, height: 36, borderRadius: 18 },
  chatBubble: { flex: 1, borderRadius: 12, padding: 10, gap: 4 },
  chatText: { fontSize: 13, lineHeight: 18 },
  chatMeta: { flexDirection: "row", justifyContent: "space-between" },
  chatTime: { fontSize: 10 },
  chatReach: { fontSize: 10 },
  replyBar: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderTopWidth: StyleSheet.hairlineWidth },
  replyInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, fontSize: 13 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  statsCard: { margin: 16, borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 8 },
  statsTitle: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statItem: { width: "47%", padding: 14, borderRadius: 12, alignItems: "center", gap: 5 },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 10, textAlign: "center" },
});

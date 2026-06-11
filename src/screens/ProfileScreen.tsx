import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import {
  Cog6ToothIcon, ShareIcon, MapPinIcon, CalendarDaysIcon,
  ExclamationTriangleIcon, UsersIcon, LockClosedIcon,
  ArrowRightOnRectangleIcon, StarIcon as StarOutlineIcon,
} from "react-native-heroicons/outline";
import {
  SunIcon, MoonIcon, StarIcon,
  CalendarDaysIcon as CalendarDaysIconSolid,
  UsersIcon as UsersIconSolid,
} from "react-native-heroicons/solid";

const IMPACT_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "calendar-outline":  CalendarDaysIcon,
  "warning-outline":   ExclamationTriangleIcon,
  "people-outline":    UsersIcon,
  "star-outline":      StarOutlineIcon,
};

const BADGE_ICON_MAP: Record<string, React.ComponentType<any>> = {
  "star":     StarIcon,
  "calendar": CalendarDaysIconSolid,
  "people":   UsersIconSolid,
};
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { CURRENT_USER, MOCK_POSTS, MOCK_VOLUNTEER_TASKS, formatCount } from "@/data/mockData";
import { palette } from "@/theme/colors";

const { width: W } = Dimensions.get("window");

const VOLUNTEER_LEVELS = [
  { level: 1, label: "Supporter",     color: "#9CA3AF", xp: 0 },
  { level: 2, label: "Active",        color: "#22C55E", xp: 500 },
  { level: 3, label: "Volunteer",     color: "#3B82F6", xp: 2000 },
  { level: 4, label: "Coordinator",   color: palette.gold[500], xp: 5000 },
  { level: 5, label: "Leader",        color: "#EAB308", xp: 10000 },
];

const PROFILE_TABS = ["Posts", "Activity", "Volunteer", "Achievements"] as const;
type ProfileTab = (typeof PROFILE_TABS)[number];

export default function ProfileScreen() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { crmUser, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ProfileTab>("Posts");
  const [showLogout, setShowLogout] = useState(false);
  const user = CURRENT_USER;
  const levelInfo = VOLUNTEER_LEVELS[user.volunteerLevel - 1];
  const nextLevel = VOLUNTEER_LEVELS[user.volunteerLevel] ?? null;
  const currentXP = 2840;
  const progressToNext = nextLevel ? (currentXP - levelInfo.xp) / (nextLevel.xp - levelInfo.xp) : 1;

  return (
    <>
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Cover photo */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: user.coverPhoto }} style={styles.cover} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={[styles.coverActions, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            style={[styles.coverBtn, { backgroundColor: "rgba(0,0,0,0.4)" }]}
            onPress={() => setShowLogout(true)}
          >
            <Cog6ToothIcon size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.coverBtn, { backgroundColor: "rgba(0,0,0,0.4)" }]}
          >
            {isDark ? <SunIcon size={20} color="#fff" /> : <MoonIcon size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar + basic info */}
      <View style={[styles.avatarSection, { backgroundColor: theme.surface }]}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={[styles.levelBadge, { backgroundColor: levelInfo.color }]}>
              <Text style={styles.levelBadgeText}>{user.volunteerLevel}</Text>
            </View>
          </View>
          <View style={styles.avatarActions}>
            <TouchableOpacity style={[styles.editBtn, { borderColor: theme.border, borderWidth: 1.5 }]}>
              <Text style={[styles.editBtnText, { color: theme.textPrimary }]}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.shareBtn, { borderColor: theme.border, borderWidth: 1.5 }]}>
              <ShareIcon size={18} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.name, { color: theme.textPrimary }]}>
          {crmUser?.full_name ?? user.name}
        </Text>
        <Text style={[styles.handle, { color: theme.textSecondary }]}>
          {crmUser?.email ? crmUser.email : `@${user.handle}`}
        </Text>

        {/* Level bar */}
        <View style={[styles.levelRow, { backgroundColor: levelInfo.color + "15", borderColor: levelInfo.color + "30" }]}>
          <View style={[styles.levelIcon, { backgroundColor: levelInfo.color }]}>
            <StarIcon size={14} color="#fff" />
          </View>
          <View style={styles.levelContent}>
            <View style={styles.levelTextRow}>
              <Text style={[styles.levelLabel, { color: levelInfo.color }]}>{levelInfo.label}</Text>
              {nextLevel && (
                <Text style={[styles.levelNext, { color: theme.textTertiary }]}>
                  Next: {nextLevel.label} ({formatCount(nextLevel.xp - currentXP)} XP away)
                </Text>
              )}
            </View>
            <View style={[styles.xpBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.xpFill,
                  { width: `${Math.min(100, progressToNext * 100)}%` as any, backgroundColor: levelInfo.color },
                ]}
              />
            </View>
          </View>
        </View>

        {user.bio && (
          <Text style={[styles.bio, { color: theme.textSecondary }]}>{user.bio}</Text>
        )}

        {/* Location */}
        <TouchableOpacity style={styles.locationRow}>
          <MapPinIcon size={14} color={theme.primary} />
          <Text style={[styles.locationText, { color: theme.textSecondary }]}>
            {user.location.constituency}, {user.location.district}
          </Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={[styles.statsRow, { borderTopColor: theme.divider }]}>
          {[
            { label: "Posts", value: user.stats.posts },
            { label: "Followers", value: user.stats.followers },
            { label: "Following", value: user.stats.following },
            { label: "Reach", value: user.stats.reachScore, isScore: true },
          ].map((stat) => (
            <TouchableOpacity key={stat.label} style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                {formatCount(stat.value)}
                {stat.isScore ? "+" : ""}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Impact summary */}
      <View style={[styles.impactCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.impactTitle, { color: theme.textPrimary }]}>Your Impact</Text>
        {(() => {
          const items = [
            { icon: "calendar-outline", label: "Events Attended", value: user.stats.eventsAttended, color: "#3B82F6" },
            { icon: "warning-outline", label: "Issues Reported", value: user.stats.issuesReported, color: palette.saffron[500] },
            { icon: "people-outline", label: "People Reached", value: user.stats.reachScore, color: "#22C55E" },
            { icon: "star-outline", label: "Volunteer Hours", value: 108, color: palette.gold[500] },
          ];
          return (
            <View style={styles.impactGrid}>
              <View style={styles.impactRow}>
                {items.slice(0, 2).map((item) => (
                  <View key={item.label} style={[styles.impactItem, { backgroundColor: item.color + "12" }]}>
                    {(() => { const IC = IMPACT_ICON_MAP[item.icon]; return IC ? <IC size={22} color={item.color} /> : null; })()}
                    <Text style={[styles.impactValue, { color: item.color }]}>{formatCount(item.value)}</Text>
                    <Text style={[styles.impactLabel, { color: theme.textTertiary }]}>{item.label}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.impactRow}>
                {items.slice(2, 4).map((item) => (
                  <View key={item.label} style={[styles.impactItem, { backgroundColor: item.color + "12" }]}>
                    {(() => { const IC = IMPACT_ICON_MAP[item.icon]; return IC ? <IC size={22} color={item.color} /> : null; })()}
                    <Text style={[styles.impactValue, { color: item.color }]}>{formatCount(item.value)}</Text>
                    <Text style={[styles.impactLabel, { color: theme.textTertiary }]}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })()}
      </View>

      {/* Badges */}
      <View style={[styles.badgesCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.badgesHeader}>
          <Text style={[styles.badgesTitle, { color: theme.textPrimary }]}>Badges & Achievements</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeScroll}>
          {user.badges.map((badge) => (
            <View key={badge.id} style={[styles.badgeItem, { backgroundColor: badge.color + "15" }]}>
              <View style={[styles.badgeIconBg, { backgroundColor: badge.color + "25" }]}>
                {(() => { const IC = BADGE_ICON_MAP[badge.icon]; return IC ? <IC size={22} color={badge.color} /> : null; })()}
              </View>
              <Text style={[styles.badgeTitle, { color: theme.textPrimary }]}>{badge.title}</Text>
            </View>
          ))}
          {/* Locked badge */}
          <View style={[styles.badgeItem, { backgroundColor: theme.surfaceSecondary }]}>
            <View style={[styles.badgeIconBg, { backgroundColor: theme.border }]}>
              <LockClosedIcon size={22} color={theme.textTertiary} />
            </View>
            <Text style={[styles.badgeTitle, { color: theme.textTertiary }]}>Mega Volunteer</Text>
          </View>
        </ScrollView>
      </View>

      {/* Profile tabs */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {PROFILE_TABS.map((tab) => (
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
                {
                  color: activeTab === tab ? theme.primary : theme.textSecondary,
                  fontWeight: activeTab === tab ? "700" : "500",
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content */}
      {activeTab === "Posts" && (
        <View>
          {MOCK_POSTS.slice(0, 3).map((post) => (
            <View
              key={post.id}
              style={[styles.miniPost, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <Text style={[styles.miniPostContent, { color: theme.textPrimary }]} numberOfLines={3}>
                {post.content}
              </Text>
              <View style={styles.miniPostMeta}>
                <Text style={[styles.miniPostStat, { color: theme.textTertiary }]}>
                  ❤️ {formatCount(post.stats.likes)}
                </Text>
                <Text style={[styles.miniPostStat, { color: theme.textTertiary }]}>
                  💬 {formatCount(post.stats.comments)}
                </Text>
                <Text style={[styles.miniPostStat, { color: theme.textTertiary }]}>
                  👁 {formatCount(post.stats.views)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === "Volunteer" && (
        <View style={{ paddingTop: 12 }}>
          {MOCK_VOLUNTEER_TASKS.map((task) => (
            <View
              key={task.id}
              style={[styles.taskCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <View style={styles.taskHeader}>
                <View
                  style={[
                    styles.taskStatusDot,
                    {
                      backgroundColor:
                        task.status === "completed" ? palette.green[500]
                        : task.status === "in_progress" ? palette.gold[500]
                        : theme.textTertiary,
                    },
                  ]}
                />
                <Text style={[styles.taskTitle, { color: theme.textPrimary }]}>{task.title}</Text>
              </View>
              <Text style={[styles.taskDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                {task.description}
              </Text>
              <View style={styles.taskMeta}>
                <View style={[styles.taskXP, { backgroundColor: palette.gold[500] + "20" }]}>
                  <Text style={[styles.taskXPText, { color: palette.gold[600] }]}>+{task.pointsReward} XP</Text>
                </View>
                <Text style={[styles.taskHours, { color: theme.textTertiary }]}>~{task.estimatedHours}h</Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor:
                        task.difficulty === "easy" ? palette.green[500] + "20"
                        : task.difficulty === "medium" ? palette.gold[500] + "20"
                        : palette.saffron[500] + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      {
                        color:
                          task.difficulty === "easy" ? palette.green[500]
                          : task.difficulty === "medium" ? palette.gold[600]
                          : palette.saffron[500],
                      },
                    ]}
                  >
                    {task.difficulty}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
      {/* Sign Out button */}
      <TouchableOpacity
        style={[styles.signOutRow, { borderColor: theme.border }]}
        onPress={() => setShowLogout(true)}
        activeOpacity={0.7}
      >
        <ArrowRightOnRectangleIcon size={20} color="#EF4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

    </ScrollView>

    {/* Logout confirmation modal */}
    <Modal visible={showLogout} transparent animationType="fade" onRequestClose={() => setShowLogout(false)}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLogout(false)}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
          <View style={styles.modalIconWrap}>
            <ArrowRightOnRectangleIcon size={32} color="#EF4444" />
          </View>
          <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Sign Out</Text>
          <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
            {crmUser?.full_name
              ? `Signing out of ${crmUser.full_name}`
              : "Are you sure you want to sign out?"}
          </Text>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={async () => { setShowLogout(false); await logout(); }}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutBtnText}>Yes, Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: theme.border }]}
            onPress={() => setShowLogout(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelBtnText, { color: theme.textPrimary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  coverContainer: { height: 160, position: "relative" },
  cover: { width: "100%", height: "100%" },
  coverActions: {
    position: "absolute",
    top: 0,
    right: 16,
    flexDirection: "row",
    gap: 8,
  },
  coverBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarSection: { paddingHorizontal: 16, paddingBottom: 16 },
  avatarRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: -30, marginBottom: 10 },
  avatarWrapper: { position: "relative" },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: "#fff" },
  levelBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  avatarActions: { flexDirection: "row", gap: 8, paddingBottom: 4 },
  editBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 10 },
  editBtnText: { fontSize: 13, fontWeight: "600" },
  shareBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 20, fontWeight: "800" },
  handle: { fontSize: 13, marginTop: 2, marginBottom: 10 },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  levelIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  levelContent: { flex: 1, gap: 5 },
  levelTextRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  levelLabel: { fontSize: 13, fontWeight: "700" },
  levelNext: { fontSize: 10 },
  xpBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  xpFill: { height: "100%", borderRadius: 3 },
  bio: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 12 },
  locationText: { fontSize: 12 },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
    marginTop: 4,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 17, fontWeight: "800" },
  statLabel: { fontSize: 11, marginTop: 2 },
  impactCard: { margin: 16, borderRadius: 16, borderWidth: 1, padding: 16 },
  impactTitle: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  impactGrid: { gap: 10 },
  impactRow: { flexDirection: "row", gap: 10 },
  impactItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 5,
  },
  impactValue: { fontSize: 20, fontWeight: "800" },
  impactLabel: { fontSize: 11, textAlign: "center" },
  badgesCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, borderWidth: 1, padding: 16 },
  badgesHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  badgesTitle: { fontSize: 15, fontWeight: "700" },
  seeAll: { fontSize: 13, fontWeight: "600" },
  badgeScroll: { gap: 10 },
  badgeItem: { alignItems: "center", width: 72, padding: 10, borderRadius: 14, gap: 6 },
  badgeIconBg: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  badgeTitle: { fontSize: 10, textAlign: "center", fontWeight: "500" },
  tabBar: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2.5,
    borderBottomColor: "transparent",
  },
  tabText: { fontSize: 12 },
  miniPost: { margin: 16, marginBottom: 0, marginTop: 12, borderRadius: 12, borderWidth: 1, padding: 12 },
  miniPostContent: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  miniPostMeta: { flexDirection: "row", gap: 12 },
  miniPostStat: { fontSize: 12 },
  taskCard: { marginHorizontal: 16, marginTop: 10, borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  taskHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  taskStatusDot: { width: 8, height: 8, borderRadius: 4 },
  taskTitle: { flex: 1, fontSize: 13, fontWeight: "600" },
  taskDesc: { fontSize: 12, lineHeight: 17 },
  taskMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  taskXP: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  taskXPText: { fontSize: 11, fontWeight: "700" },
  taskHours: { fontSize: 11 },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  difficultyText: { fontSize: 10, fontWeight: "600", textTransform: "capitalize" },

  // Sign out row
  signOutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  signOutText: { fontSize: 15, fontWeight: "600", color: "#EF4444" },

  // Logout modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  modalCard: {
    width: "100%",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 6 },
  modalSub: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 24 },
  logoutBtn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logoutBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  cancelBtn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: { fontSize: 15, fontWeight: "600" },
});

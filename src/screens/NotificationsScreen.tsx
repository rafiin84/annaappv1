import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  ArrowLeftIcon,
  BellSlashIcon,
  UserPlusIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  TrophyIcon,
  RocketLaunchIcon,
  AtSymbolIcon,
} from "react-native-heroicons/outline";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "react-native-heroicons/solid";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "@/contexts/ThemeContext";
import { MOCK_NOTIFICATIONS, formatTimeAgo } from "@/data/mockData";
import { Notification } from "@/types";
import { palette } from "@/theme/colors";

const NOTIF_TABS = ["All", "Unread", "Local", "Leaders"] as const;

const TYPE_CONFIG: Record<string, { Icon: React.ComponentType<any>; color: string; bg: string }> = {
  like:             { Icon: HeartIcon,             color: "#EF4444",            bg: "#EF444420" },
  comment:          { Icon: ChatBubbleLeftIcon,    color: "#3B82F6",            bg: "#3B82F620" },
  follow:           { Icon: UserPlusIcon,          color: "#22C55E",            bg: "#22C55E20" },
  event_reminder:   { Icon: CalendarDaysIcon,      color: palette.saffron[500], bg: palette.saffron[500] + "20" },
  leader_message:   { Icon: MegaphoneIcon,         color: palette.gold[500],    bg: palette.gold[500] + "20" },
  community_update: { Icon: UsersIcon,             color: "#8B5CF6",            bg: "#8B5CF620" },
  achievement:      { Icon: TrophyIcon,            color: palette.gold[500],    bg: palette.gold[500] + "20" },
  local_alert:      { Icon: ExclamationTriangleIcon, color: "#F59E0B",          bg: "#F59E0B20" },
  campaign_update:  { Icon: RocketLaunchIcon,      color: palette.saffron[500], bg: palette.saffron[500] + "20" },
  mention:          { Icon: AtSymbolIcon,          color: "#3B82F6",            bg: "#3B82F620" },
};

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "Unread") return !n.isRead;
    if (activeTab === "Local") return n.type === "local_alert" || n.type === "event_reminder";
    if (activeTab === "Leaders") return n.type === "leader_message" || n.type === "campaign_update";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const renderNotif = ({ item }: { item: Notification }) => {
    const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.mention;
    return (
      <TouchableOpacity
        style={[
          styles.notifRow,
          {
            backgroundColor: item.isRead ? theme.surface : theme.primaryLight,
            borderBottomColor: theme.divider,
          },
        ]}
        onPress={() => setNotifications((prev) => prev.map((n) => n.id === item.id ? { ...n, isRead: true } : n))}
      >
        <View style={[styles.notifIcon, { backgroundColor: config.bg }]}>
          {item.actor ? (
            <View>
              <Image source={{ uri: item.actor.avatar }} style={styles.notifAvatar} />
              <View style={[styles.notifTypeDot, { backgroundColor: config.color }]}>
                <config.Icon size={8} color="#fff" />
              </View>
            </View>
          ) : (
            <config.Icon size={22} color={config.color} />
          )}
        </View>

        <View style={styles.notifContent}>
          <Text style={[styles.notifTitle, { color: theme.textPrimary, fontWeight: item.isRead ? "500" : "700" }]}>
            {item.title}
          </Text>
          <Text style={[styles.notifBody, { color: theme.textSecondary }]} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={[styles.notifTime, { color: theme.textTertiary }]}>
            {formatTimeAgo(item.createdAt)}
          </Text>
        </View>

        {!item.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeftIcon size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={markAllRead} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.markAllText, { color: theme.primary }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {NOTIF_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && { borderBottomWidth: 2.5, borderBottomColor: theme.primary }]}
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderNotif}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <BellSlashIcon size={48} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No notifications here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  unreadBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  unreadBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  markAllText: { fontSize: 12, fontWeight: "600" },
  tabBar: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12, borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabText: { fontSize: 13, fontWeight: "500" },
  notifRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  notifIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", position: "relative" },
  notifAvatar: { width: 48, height: 48, borderRadius: 24 },
  notifTypeDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  notifContent: { flex: 1, gap: 3 },
  notifTitle: { fontSize: 14, lineHeight: 19 },
  notifBody: { fontSize: 12, lineHeight: 17 },
  notifTime: { fontSize: 11 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  empty: { paddingTop: 80, alignItems: "center", gap: 12 },
  emptyText: { fontSize: 15 },
});

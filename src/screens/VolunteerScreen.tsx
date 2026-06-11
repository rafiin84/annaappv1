import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  CalendarDaysIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  CubeIcon,
  MegaphoneIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  ShareIcon,
  UserPlusIcon,
  ArrowUpIcon,
  PlusCircleIcon,
  ClockIcon,
  TruckIcon,
  BeakerIcon,
  TrashIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
} from "react-native-heroicons/outline";
import { StarIcon, UsersIcon, BoltIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { CURRENT_USER, MOCK_VOLUNTEER_TASKS, MOCK_ISSUES, formatCount, formatTimeAgo } from "@/data/mockData";
import { palette } from "@/theme/colors";

const VOLUNTEER_TABS = ["Tasks", "Local Issues", "Leaderboard"] as const;
type VTab = (typeof VOLUNTEER_TABS)[number];

const LEADERBOARD = [
  { rank: 1, name: "Priya Raj", avatar: "https://randomuser.me/api/portraits/women/44.jpg", xp: 8420, constituency: "Coimbatore North" },
  { rank: 2, name: "Arjun S", avatar: "https://randomuser.me/api/portraits/men/73.jpg", xp: 7890, constituency: "Coimbatore North" },
  { rank: 3, name: "Murugan K", avatar: "https://randomuser.me/api/portraits/men/56.jpg", xp: 6540, constituency: "Coimbatore South" },
  { rank: 4, name: "Deepa M", avatar: "https://randomuser.me/api/portraits/women/29.jpg", xp: 5120, constituency: "Singanallur" },
  { rank: 5, name: "K. Annamalai (You)", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/K._Annamalai_at_padayatra.jpg/250px-K._Annamalai_at_padayatra.jpg", xp: 2840, constituency: "Coimbatore North", isYou: true },
];

export default function VolunteerScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<VTab>("Tasks");

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: insets.top + 8 }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Volunteer Hub</Text>
        <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
          Earn XP · Rise in ranks · Make change
        </Text>
      </View>

      {/* My XP card */}
      <View style={styles.xpCardWrapper}>
        <LinearGradient
          colors={[palette.saffron[600], palette.saffron[400], palette.gold[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.xpCard}
        >
          <View style={styles.xpCardContent}>
            <View>
              <Text style={styles.xpGreeting}>Hello, {CURRENT_USER.name.split(" ")[0]} 👋</Text>
              <Text style={styles.xpLevel}>Level {CURRENT_USER.volunteerLevel} · Volunteer</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpValue}>2,840</Text>
              <Text style={styles.xpLabel}>XP</Text>
            </View>
          </View>
          <View style={styles.xpProgressWrapper}>
            <View style={styles.xpProgressBg}>
              <View style={[styles.xpProgressFill, { width: "56.8%" }]} />
            </View>
            <Text style={styles.xpProgressText}>2,840 / 5,000 XP to Level 4</Text>
          </View>
          <View style={styles.xpQuickStats}>
            <QuickStat Icon={CalendarDaysIcon} label="Events" value="23" />
            <QuickStat Icon={ExclamationTriangleIcon} label="Issues" value="12" />
            <QuickStat Icon={UsersIcon} label="Recruited" value="8" />
            <QuickStat Icon={ClockIcon} label="Hours" value="108" />
          </View>
        </LinearGradient>
      </View>

      {/* Tab bar */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {VOLUNTEER_TABS.map((tab) => (
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {activeTab === "Tasks" && <TasksTab theme={theme} />}
        {activeTab === "Local Issues" && <LocalIssuesTab theme={theme} />}
        {activeTab === "Leaderboard" && <LeaderboardTab theme={theme} />}
      </ScrollView>
    </View>
  );
}

function QuickStat({ Icon, label, value }: { Icon: React.ComponentType<any>; label: string; value: string }) {
  return (
    <View style={styles.quickStat}>
      <Icon size={14} color="rgba(255,255,255,0.8)" />
      <Text style={styles.quickStatValue}>{value}</Text>
      <Text style={styles.quickStatLabel}>{label}</Text>
    </View>
  );
}

function TasksTab({ theme }: { theme: any }) {
  const [tasks, setTasks] = useState(MOCK_VOLUNTEER_TASKS);

  const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
    outreach: MegaphoneIcon,
    event_support: CalendarDaysIcon,
    digital: DevicePhoneMobileIcon,
    field: UserIcon,
    logistics: CubeIcon,
  };

  return (
    <View style={{ paddingTop: 16 }}>
      {/* Quick action row */}
      <View style={styles.quickActionRow}>
        {[
          { Icon: ExclamationTriangleIcon, label: "Report Issue",   color: "#EF4444" },
          { Icon: CameraIcon,              label: "Document Event", color: "#3B82F6" },
          { Icon: ShareIcon,               label: "Share Post",     color: "#22C55E" },
          { Icon: UserPlusIcon,            label: "Recruit",        color: palette.gold[500] },
        ].map((action) => (
          <TouchableOpacity
            key={action.label}
            style={[styles.quickAction, { backgroundColor: action.color + "15" }]}
          >
            <action.Icon size={20} color={action.color} />
            <Text style={[styles.quickActionLabel, { color: theme.textPrimary }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Available Tasks</Text>
      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={[styles.taskCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        >
          <View style={styles.taskTop}>
            <View style={[styles.taskCatIcon, { backgroundColor: theme.primaryLight }]}>
              {(() => { const IC = CATEGORY_ICONS[task.category]; return IC ? <IC size={18} color={theme.primary} /> : null; })()}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskTitle, { color: theme.textPrimary }]}>{task.title}</Text>
              <Text style={[styles.taskDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                {task.description}
              </Text>
            </View>
          </View>
          <View style={styles.taskBottom}>
            <View style={[styles.xpChip, { backgroundColor: palette.gold[500] + "20" }]}>
              <StarIcon size={10} color={palette.gold[600]} />
              <Text style={[styles.xpChipText, { color: palette.gold[600] }]}>+{task.pointsReward} XP</Text>
            </View>
            <View style={[styles.diffChip, { backgroundColor: theme.surfaceSecondary }]}>
              <Text style={[styles.diffChipText, { color: theme.textSecondary }]}>
                {task.difficulty} · ~{task.estimatedHours}h
              </Text>
            </View>
            {task.deadline && (
              <Text style={[styles.taskDeadline, { color: theme.textTertiary }]}>
                Due {new Date(task.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </Text>
            )}
            <TouchableOpacity
              style={[
                styles.claimBtn,
                {
                  backgroundColor:
                    task.status === "in_progress" ? theme.primaryLight
                    : task.status === "completed" ? palette.green[500] + "20"
                    : theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.claimBtnText,
                  {
                    color:
                      task.status === "in_progress" ? theme.primary
                      : task.status === "completed" ? palette.green[500]
                      : "#fff",
                  },
                ]}
              >
                {task.status === "in_progress" ? "In Progress" : task.status === "completed" ? "Done ✓" : "Claim"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function LocalIssuesTab({ theme }: { theme: any }) {
  const [issues, setIssues] = useState(MOCK_ISSUES);

  const STATUS_CONFIG = {
    open: { color: "#EF4444", label: "Open" },
    acknowledged: { color: "#F59E0B", label: "Acknowledged" },
    in_progress: { color: "#3B82F6", label: "In Progress" },
    resolved: { color: "#22C55E", label: "Resolved" },
  };

  const ISSUE_CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
    road:        TruckIcon,
    water:       BeakerIcon,
    electricity: BoltIcon,
    sanitation:  TrashIcon,
    safety:      ShieldCheckIcon,
    education:   AcademicCapIcon,
    health:      HeartIcon,
    other:       EllipsisHorizontalIcon,
  };

  return (
    <View style={{ paddingTop: 16 }}>
      <View style={styles.issueSummary}>
        {[
          { label: "Open", count: issues.filter((i) => i.status === "open").length, color: "#EF4444" },
          { label: "In Progress", count: issues.filter((i) => i.status === "in_progress").length, color: "#3B82F6" },
          { label: "Resolved", count: issues.filter((i) => i.status === "resolved").length, color: "#22C55E" },
        ].map((s) => (
          <View key={s.label} style={[styles.issueStat, { backgroundColor: s.color + "15" }]}>
            <Text style={[styles.issueStatVal, { color: s.color }]}>{s.count}</Text>
            <Text style={[styles.issueStatLabel, { color: theme.textSecondary }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Reported Issues Near You</Text>
      {issues.map((issue) => {
        const statusConf = STATUS_CONFIG[issue.status];
        return (
          <View key={issue.id} style={[styles.issueCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.issueHeader}>
              <View style={[styles.issueCatIcon, { backgroundColor: palette.saffron[500] + "15" }]}>
                {(() => { const IC = ISSUE_CATEGORY_ICONS[issue.category]; return IC ? <IC size={18} color={palette.saffron[500]} /> : null; })()}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.issueTitle, { color: theme.textPrimary }]}>{issue.title}</Text>
                <Text style={[styles.issueLocation, { color: theme.textTertiary }]}>
                  📍 {issue.location.address}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusConf.color + "20" }]}>
                <Text style={[styles.statusText, { color: statusConf.color }]}>{statusConf.label}</Text>
              </View>
            </View>
            <Text style={[styles.issueDesc, { color: theme.textSecondary }]} numberOfLines={2}>
              {issue.description}
            </Text>
            <View style={styles.issueFooter}>
              <Image source={{ uri: issue.reportedBy.avatar }} style={styles.issueReporterAvatar} />
              <Text style={[styles.issueReporter, { color: theme.textTertiary }]}>
                {issue.reportedBy.name} · {formatTimeAgo(issue.createdAt)}
              </Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                style={[styles.upvoteBtn, { backgroundColor: issue.upvoted ? theme.primaryLight : theme.surfaceSecondary }]}
                onPress={() => setIssues((prev) => prev.map((i) => i.id === issue.id ? { ...i, upvoted: !i.upvoted, upvotes: i.upvoted ? i.upvotes - 1 : i.upvotes + 1 } : i))}
              >
                <ArrowUpIcon size={14} color={issue.upvoted ? theme.primary : theme.textSecondary} />
                <Text style={[styles.upvoteCount, { color: issue.upvoted ? theme.primary : theme.textSecondary }]}>
                  {formatCount(issue.upvotes)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <TouchableOpacity style={[styles.reportCTA, { backgroundColor: theme.primary }]}>
        <PlusCircleIcon size={20} color="#fff" />
        <Text style={styles.reportCTAText}>Report a Local Issue</Text>
      </TouchableOpacity>
    </View>
  );
}

function LeaderboardTab({ theme }: { theme: any }) {
  return (
    <View style={{ paddingTop: 16 }}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        🏆 Coimbatore North · This Month
      </Text>
      {LEADERBOARD.map((person) => (
        <View
          key={person.rank}
          style={[
            styles.leaderboardRow,
            {
              backgroundColor: person.isYou ? theme.primaryLight : theme.card,
              borderColor: person.isYou ? theme.primary : theme.cardBorder,
            },
          ]}
        >
          <View style={[styles.rankBadge, { backgroundColor: person.rank <= 3 ? palette.gold[500] : theme.surfaceSecondary }]}>
            <Text style={[styles.rankText, { color: person.rank <= 3 ? "#fff" : theme.textSecondary }]}>
              #{person.rank}
            </Text>
          </View>
          <Image source={{ uri: person.avatar }} style={styles.lbAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.lbName, { color: theme.textPrimary, fontWeight: person.isYou ? "700" : "500" }]}>
              {person.name}
            </Text>
            <Text style={[styles.lbConstituency, { color: theme.textTertiary }]}>{person.constituency}</Text>
          </View>
          <View style={[styles.xpChip, { backgroundColor: palette.gold[500] + "20" }]}>
            <Text style={[styles.xpChipText, { color: palette.gold[600] }]}>
              {formatCount(person.xp)} XP
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  headerSub: { fontSize: 12, marginTop: 2 },
  xpCardWrapper: { marginHorizontal: 16, marginTop: 16 },
  xpCard: { borderRadius: 20, padding: 16, gap: 12 },
  xpCardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  xpGreeting: { color: "rgba(255,255,255,0.9)", fontSize: 14 },
  xpLevel: { color: "#fff", fontSize: 16, fontWeight: "700", marginTop: 2 },
  xpBadge: { alignItems: "center", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 10 },
  xpValue: { color: "#fff", fontSize: 22, fontWeight: "900" },
  xpLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  xpProgressWrapper: { gap: 4 },
  xpProgressBg: { height: 8, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 4, overflow: "hidden" },
  xpProgressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 4 },
  xpProgressText: { color: "rgba(255,255,255,0.8)", fontSize: 11 },
  xpQuickStats: { flexDirection: "row", justifyContent: "space-between" },
  quickStat: { alignItems: "center", gap: 3 },
  quickStatValue: { color: "#fff", fontSize: 16, fontWeight: "800" },
  quickStatLabel: { color: "rgba(255,255,255,0.7)", fontSize: 10 },
  tabBar: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12, borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabText: { fontSize: 13, fontWeight: "500" },
  quickActionRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginBottom: 20 },
  quickAction: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, gap: 5 },
  quickActionLabel: { fontSize: 10, fontWeight: "600", textAlign: "center" },
  sectionTitle: { fontSize: 15, fontWeight: "700", paddingHorizontal: 16, marginBottom: 10 },
  taskCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  taskTop: { flexDirection: "row", gap: 10 },
  taskCatIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  taskTitle: { fontSize: 13, fontWeight: "600" },
  taskDesc: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  taskBottom: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  xpChip: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  xpChipText: { fontSize: 11, fontWeight: "700" },
  diffChip: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  diffChipText: { fontSize: 10 },
  taskDeadline: { fontSize: 10 },
  claimBtn: { marginLeft: "auto", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  claimBtnText: { fontSize: 12, fontWeight: "700" },
  issueSummary: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  issueStat: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12 },
  issueStatVal: { fontSize: 22, fontWeight: "800" },
  issueStatLabel: { fontSize: 11, marginTop: 2 },
  issueCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  issueHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  issueCatIcon: { width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  issueTitle: { fontSize: 13, fontWeight: "600" },
  issueLocation: { fontSize: 11, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: "700" },
  issueDesc: { fontSize: 12, lineHeight: 17 },
  issueFooter: { flexDirection: "row", alignItems: "center", gap: 6 },
  issueReporterAvatar: { width: 20, height: 20, borderRadius: 10 },
  issueReporter: { fontSize: 11 },
  upvoteBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  upvoteCount: { fontSize: 12, fontWeight: "600" },
  reportCTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 16,
    padding: 14,
    borderRadius: 14,
  },
  reportCTAText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  leaderboardRow: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 14, borderWidth: 1.5 },
  rankBadge: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  rankText: { fontSize: 12, fontWeight: "800" },
  lbAvatar: { width: 40, height: 40, borderRadius: 20 },
  lbName: { fontSize: 14 },
  lbConstituency: { fontSize: 11, marginTop: 2 },
});

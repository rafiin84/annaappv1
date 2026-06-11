import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  PlayCircleIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import { UsersIcon, ExclamationTriangleIcon } from "react-native-heroicons/solid";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "@/contexts/LocationContext";
import { MOCK_POSTS, MOCK_EVENTS, formatCount } from "@/data/mockData";
import { palette } from "@/theme/colors";

const TRENDING_TAGS = [
  { tag: "NammaKatchchi", posts: "2.4L" },
  { tag: "CleanTN", posts: "89K" },
  { tag: "CoimbatoreNorth", posts: "34K" },
  { tag: "Youth4TN", posts: "28K" },
  { tag: "VolunteerLife", posts: "21K" },
  { tag: "FixOurRoads", posts: "18K" },
  { tag: "Mission1Crore", posts: "15K" },
  { tag: "TamilNadu2024", posts: "12K" },
];

const SUGGESTED_PEOPLE = [
  { id: "u2", name: "Priya Raj", handle: "priya_cbenorth", avatar: "https://randomuser.me/api/portraits/women/44.jpg", role: "Volunteer, Coimbatore North", followers: 1284, isFollowing: false },
  { id: "u3", name: "Murugan K", handle: "murugan_cbe", avatar: "https://randomuser.me/api/portraits/men/56.jpg", role: "Supporter, Coimbatore South", followers: 892, isFollowing: false },
  { id: "u4", name: "Lakshmi V", handle: "lakshmi_coord", avatar: "https://randomuser.me/api/portraits/women/68.jpg", role: "Coordinator, Coimbatore", followers: 4280, isFollowing: true },
  { id: "u5", name: "Arjun S", handle: "arjun_volunteer", avatar: "https://randomuser.me/api/portraits/men/73.jpg", role: "Volunteer, Coimbatore North", followers: 567, isFollowing: false },
];

const CATEGORIES: { id: string; label: string; Icon: React.ComponentType<any> }[] = [
  { id: "all",       label: "All",       Icon: Squares2X2Icon },
  { id: "events",    label: "Events",    Icon: CalendarDaysIcon },
  { id: "people",    label: "People",    Icon: UsersIcon },
  { id: "videos",    label: "Videos",    Icon: PlayCircleIcon },
  { id: "issues",    label: "Issues",    Icon: ExclamationTriangleIcon },
  { id: "campaigns", label: "Campaigns", Icon: RocketLaunchIcon },
];

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: insets.top + 8 }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Discover</Text>
        <View style={[styles.searchBar, { backgroundColor: theme.surfaceSecondary, borderColor: focused ? theme.primary : theme.border }]}>
          <MagnifyingGlassIcon size={18} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder={`Search ${location.constituency}, ${location.district}...`}
            placeholderTextColor={theme.textTertiary}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <XCircleIcon size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category filter */}
      <View style={[styles.catWrapper, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={[
                styles.catChip,
                activeCategory === cat.id
                  ? { backgroundColor: theme.primary }
                  : { backgroundColor: theme.surfaceSecondary, borderColor: theme.border, borderWidth: 1 },
              ]}
            >
              <cat.Icon
                size={14}
                color={activeCategory === cat.id ? "#fff" : theme.textSecondary}
              />
              <Text
                style={[
                  styles.catLabel,
                  { color: activeCategory === cat.id ? "#fff" : theme.textSecondary },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Trending near you */}
        <Section title={`🔥 Trending in ${location.district}`} theme={theme}>
          <View style={styles.trendingGrid}>
            {TRENDING_TAGS.map((item, i) => (
              <TouchableOpacity
                key={item.tag}
                style={[styles.trendingChip, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              >
                <Text style={[styles.trendingRank, { color: theme.textTertiary }]}>#{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.trendingTag, { color: theme.textPrimary }]}>#{item.tag}</Text>
                  <Text style={[styles.trendingPosts, { color: theme.textTertiary }]}>{item.posts} posts</Text>
                </View>
                <ArrowTrendingUpIcon size={16} color={theme.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* People to follow */}
        <Section title="👥 People to Follow" theme={theme}>
          {SUGGESTED_PEOPLE.map((person) => (
            <PersonRow key={person.id} person={person} theme={theme} />
          ))}
        </Section>

        {/* Upcoming local events */}
        <Section title={`📅 Events Near You`} theme={theme}>
          {MOCK_EVENTS.slice(0, 3).map((event) => {
            const dateObj = new Date(event.date);
            return (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              >
                <View style={[styles.eventDateBox, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.eventDay, { color: theme.primary }]}>
                    {dateObj.getDate()}
                  </Text>
                  <Text style={[styles.eventMonth, { color: theme.primary }]}>
                    {dateObj.toLocaleDateString("en-IN", { month: "short" }).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.eventRowContent}>
                  <Text style={[styles.eventRowTitle, { color: theme.textPrimary }]} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <Text style={[styles.eventRowLocation, { color: theme.textSecondary }]} numberOfLines={1}>
                    📍 {event.location.address}
                  </Text>
                </View>
                <ChevronRightIcon size={16} color={theme.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </Section>

        {/* Post grid preview */}
        <Section title="📸 Visual Feed" theme={theme} noInner>
          <View style={styles.photoGrid}>
            {MOCK_POSTS.filter((p) => p.media?.length).map((post) =>
              post.media!.map((m, i) => (
                <TouchableOpacity key={`${post.id}-${i}`} style={styles.gridItem}>
                  <Image source={{ uri: m.url }} style={styles.gridImg} resizeMode="cover" />
                </TouchableOpacity>
              ))
            )}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({
  title, children, theme, noInner = false,
}: { title: string; children: React.ReactNode; theme: any; noInner?: boolean }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{title}</Text>
      {noInner ? children : <View style={styles.sectionInner}>{children}</View>}
    </View>
  );
}

function PersonRow({ person, theme }: { person: typeof SUGGESTED_PEOPLE[0]; theme: any }) {
  const [following, setFollowing] = useState(person.isFollowing);
  return (
    <View style={[styles.personRow, { borderBottomColor: theme.divider }]}>
      <Image source={{ uri: person.avatar }} style={styles.personAvatar} />
      <View style={styles.personInfo}>
        <Text style={[styles.personName, { color: theme.textPrimary }]}>{person.name}</Text>
        <Text style={[styles.personHandle, { color: theme.textTertiary }]}>@{person.handle}</Text>
        <Text style={[styles.personRole, { color: theme.textSecondary }]}>{person.role}</Text>
      </View>
      <TouchableOpacity
        onPress={() => setFollowing((v) => !v)}
        style={[
          styles.followBtn,
          following
            ? { backgroundColor: "transparent", borderColor: theme.border, borderWidth: 1 }
            : { backgroundColor: theme.primary },
        ]}
      >
        <Text style={[styles.followBtnText, { color: following ? theme.textPrimary : "#fff" }]}>
          {following ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: "800", marginBottom: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  catWrapper: { borderBottomWidth: StyleSheet.hairlineWidth },
  catScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  catLabel: { fontSize: 13, fontWeight: "600" },
  section: { paddingTop: 20 },
  sectionTitle: { fontSize: 15, fontWeight: "700", paddingHorizontal: 16, marginBottom: 10 },
  sectionInner: { paddingHorizontal: 16, gap: 8 },
  trendingGrid: { gap: 6 },
  trendingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  trendingRank: { fontSize: 12, width: 20 },
  trendingTag: { fontSize: 13, fontWeight: "600" },
  trendingPosts: { fontSize: 11, marginTop: 2 },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  personAvatar: { width: 44, height: 44, borderRadius: 22 },
  personInfo: { flex: 1 },
  personName: { fontSize: 14, fontWeight: "700" },
  personHandle: { fontSize: 11, marginTop: 1 },
  personRole: { fontSize: 11, marginTop: 2 },
  followBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  followBtnText: { fontSize: 13, fontWeight: "700" },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 6,
  },
  eventDateBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  eventDay: { fontSize: 17, fontWeight: "800" },
  eventMonth: { fontSize: 9, fontWeight: "700" },
  eventRowContent: { flex: 1 },
  eventRowTitle: { fontSize: 13, fontWeight: "600", marginBottom: 3 },
  eventRowLocation: { fontSize: 11 },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 2 },
  gridItem: { width: "33.33%", aspectRatio: 1, padding: 1 },
  gridImg: { width: "100%", height: "100%" },
});

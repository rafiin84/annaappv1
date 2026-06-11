import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  CalendarDaysIcon, MapPinIcon, MegaphoneIcon, AcademicCapIcon,
  SparklesIcon, UsersIcon, RocketLaunchIcon, PlusIcon,
  ChevronLeftIcon, ChevronRightIcon, ListBulletIcon,
} from "react-native-heroicons/outline";

const FILTER_ICON_MAP: Record<string, React.ComponentType<any>> = {
  calendar: CalendarDaysIcon,
  location: MapPinIcon,
  megaphone: MegaphoneIcon,
  school: AcademicCapIcon,
  leaf: SparklesIcon,
  people: UsersIcon,
  rocket: RocketLaunchIcon,
};
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "@/contexts/LocationContext";
import EventCard from "@/components/EventCard";
import { MOCK_EVENTS } from "@/data/mockData";
import { Event } from "@/types";
import { palette } from "@/theme/colors";

const FILTERS = [
  { id: "all", label: "All Events", icon: "calendar" },
  { id: "nearby", label: "Near Me", icon: "location" },
  { id: "rally", label: "Rally", icon: "megaphone" },
  { id: "training", label: "Training", icon: "school" },
  { id: "cleanup", label: "Cleanup", icon: "leaf" },
  { id: "meeting", label: "Meeting", icon: "people" },
  { id: "campaign", label: "Campaign", icon: "rocket" },
] as const;

const UPCOMING_MONTHS = ["Jun 2024", "Jul 2024", "Aug 2024"];

export default function EventsScreen() {
  const { theme } = useTheme();
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const filtered =
    activeFilter === "all" || activeFilter === "nearby"
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((e) => e.category === activeFilter);

  const attending = MOCK_EVENTS.filter((e) => e.rsvpStatus === "attending");
  const interested = MOCK_EVENTS.filter((e) => e.rsvpStatus === "interested");

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Events</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            📍 {location.constituency} & nearby
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setViewMode((v) => (v === "list" ? "calendar" : "list"))}
            style={[styles.viewToggle, { backgroundColor: theme.surfaceSecondary }]}
          >
            {viewMode === "list" ? <CalendarDaysIcon size={20} color={theme.textPrimary} /> : <ListBulletIcon size={20} color={theme.textPrimary} />}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.createBtn, { backgroundColor: theme.primary }]}>
            <PlusIcon size={18} color="#fff" />
            <Text style={styles.createBtnText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter chips */}
      <View style={[styles.filterWrapper, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setActiveFilter(f.id)}
              style={[
                styles.filterChip,
                activeFilter === f.id
                  ? { backgroundColor: theme.primary }
                  : { backgroundColor: theme.surfaceSecondary, borderColor: theme.border, borderWidth: 1 },
              ]}
            >
              {(() => { const IC = FILTER_ICON_MAP[f.icon]; return IC ? <IC size={13} color={activeFilter === f.id ? "#fff" : theme.textSecondary} /> : null; })()}
              <Text
                style={[
                  styles.filterLabel,
                  { color: activeFilter === f.id ? "#fff" : theme.textSecondary },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* My RSVP section */}
        {attending.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <View style={[styles.sectionBadge, { backgroundColor: palette.green[500] + "20" }]}>
                <Text style={[styles.sectionBadgeText, { color: palette.green[500] }]}>
                  ✓ {attending.length} Attending
                </Text>
              </View>
            </View>
            {attending.map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </View>
        )}

        {/* Featured events */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>⭐ Featured</Text>
          {filtered
            .filter((e) => e.isFeatured)
            .map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
        </View>

        {/* This week */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>📅 This Week</Text>
          {filtered
            .filter((e) => !e.isFeatured)
            .map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
        </View>

        {/* Calendar mini view */}
        <View style={[styles.calendarCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.calendarHeader}>
            <Text style={[styles.calendarTitle, { color: theme.textPrimary }]}>June 2024</Text>
            <View style={styles.calendarNav}>
              <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <ChevronLeftIcon size={18} color={theme.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <ChevronRightIcon size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.calendarDayRow}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <Text key={i} style={[styles.calendarDayLabel, { color: theme.textTertiary }]}>{d}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const hasEvent = [15, 16, 18, 21].includes(day);
              const isToday = day === 10;
              return (
                <TouchableOpacity key={day} style={styles.calendarCell}>
                  <View
                    style={[
                      styles.calendarDay,
                      isToday && { backgroundColor: theme.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.calendarDayNum,
                        { color: isToday ? "#fff" : theme.textPrimary },
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                  {hasEvent && (
                    <View style={[styles.eventDot, { backgroundColor: theme.primary }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Create event CTA */}
        <View style={[styles.createCTA, { backgroundColor: theme.primaryLight, borderColor: theme.primary + "30" }]}>
          <CalendarDaysIcon size={28} color={theme.primary} />
          <Text style={[styles.createCTATitle, { color: theme.textPrimary }]}>Organize an Event</Text>
          <Text style={[styles.createCTASub, { color: theme.textSecondary }]}>
            Rally your constituency. Create meetups, drives, and campaigns.
          </Text>
          <TouchableOpacity style={[styles.createCTABtn, { backgroundColor: theme.primary }]}>
            <Text style={styles.createCTABtnText}>Create Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerSub: { fontSize: 12, marginTop: 2 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  viewToggle: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  createBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  filterWrapper: { borderBottomWidth: StyleSheet.hairlineWidth },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterLabel: { fontSize: 12, fontWeight: "600" },
  section: { paddingTop: 16 },
  sectionRow: { paddingHorizontal: 16, marginBottom: 10 },
  sectionBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  sectionBadgeText: { fontSize: 12, fontWeight: "700" },
  sectionTitle: { fontSize: 15, fontWeight: "700", paddingHorizontal: 16, marginBottom: 8 },
  calendarCard: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  calendarHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  calendarTitle: { fontSize: 15, fontWeight: "700" },
  calendarNav: { flexDirection: "row", gap: 8 },
  calendarDayRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  calendarDayLabel: { width: 32, textAlign: "center", fontSize: 11, fontWeight: "600" },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  calendarCell: { width: "14.28%", alignItems: "center", paddingVertical: 3 },
  calendarDay: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  calendarDayNum: { fontSize: 13, fontWeight: "500" },
  eventDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  createCTA: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  createCTATitle: { fontSize: 16, fontWeight: "700" },
  createCTASub: { fontSize: 13, textAlign: "center", lineHeight: 18 },
  createCTABtn: { marginTop: 4, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  createCTABtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});

import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Event } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { palette } from "@/theme/colors";
import { formatCount } from "@/data/mockData";

interface Props {
  event: Event;
  onPress?: (event: Event) => void;
  compact?: boolean;
}

const CATEGORY_CONFIG = {
  rally:    { label: "Rally",    color: "#EF4444", icon: "megaphone" },
  training: { label: "Training", color: "#8B5CF6", icon: "school" },
  cleanup:  { label: "Cleanup",  color: "#22C55E", icon: "leaf" },
  meeting:  { label: "Meeting",  color: "#3B82F6", icon: "people" },
  campaign: { label: "Campaign", color: palette.saffron[500], icon: "rocket" },
  cultural: { label: "Cultural", color: palette.gold[500], icon: "musical-notes" },
};

export default function EventCard({ event, onPress, compact = false }: Props) {
  const { theme } = useTheme();
  const [rsvp, setRsvp] = useState<string | null>(event.rsvpStatus ?? null);
  const cat = CATEGORY_CONFIG[event.category];
  const dateObj = new Date(event.date);
  const dayStr = dateObj.toLocaleDateString("en-IN", { day: "numeric" });
  const monthStr = dateObj.toLocaleDateString("en-IN", { month: "short" });

  if (compact) {
    return (
      <TouchableOpacity
        onPress={() => onPress?.(event)}
        activeOpacity={0.85}
        style={[styles.compactCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      >
        <View style={[styles.compactDate, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.compactDay, { color: theme.primary }]}>{dayStr}</Text>
          <Text style={[styles.compactMonth, { color: theme.primary }]}>{monthStr}</Text>
        </View>
        <View style={styles.compactContent}>
          <Text style={[styles.compactTitle, { color: theme.textPrimary }]} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={[styles.compactLocation, { color: theme.textSecondary }]} numberOfLines={1}>
            📍 {event.location.address}
          </Text>
          <View style={styles.compactMeta}>
            <View style={[styles.catBadge, { backgroundColor: cat.color + "18" }]}>
              <Text style={[styles.catText, { color: cat.color }]}>{cat.label}</Text>
            </View>
            <Text style={[styles.attendees, { color: theme.textTertiary }]}>
              {formatCount(event.stats.attending)} going
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress?.(event)}
      activeOpacity={0.88}
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
    >
      {/* Cover */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: event.coverImage }} style={styles.cover} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.coverGradient}
        />
        {event.isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        {event.isFeatured && (
          <View style={[styles.featuredBadge, { backgroundColor: palette.gold[500] }]}>
            <Ionicons name="star" size={10} color="#fff" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        <View style={styles.coverDateBadge}>
          <Text style={styles.coverDay}>{dayStr}</Text>
          <Text style={styles.coverMonth}>{monthStr}</Text>
        </View>
        <View style={[styles.coverCat, { backgroundColor: cat.color }]}>
          <Text style={styles.coverCatText}>{cat.label}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={13} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>{event.time}</Text>
          <View style={styles.dot} />
          <Ionicons name="location-outline" size={13} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]} numberOfLines={1}>
            {event.location.address}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.attendeeAvatars}>
            {[0, 1, 2].map((i) => (
              <Image
                key={i}
                source={{ uri: `https://randomuser.me/api/portraits/thumb/men/${20 + i}.jpg` }}
                style={[styles.microAvatar, { marginLeft: i > 0 ? -8 : 0 }]}
              />
            ))}
            <Text style={[styles.attendeeCount, { color: theme.textSecondary }]}>
              {formatCount(event.stats.attending)} going
            </Text>
          </View>
          {event.stats.capacity && (
            <Text style={[styles.capacity, { color: theme.textTertiary }]}>
              {event.stats.capacity - event.stats.attending} spots left
            </Text>
          )}
        </View>

        {/* RSVP Buttons */}
        <View style={styles.rsvpRow}>
          <TouchableOpacity
            onPress={() => setRsvp(rsvp === "attending" ? null : "attending")}
            style={[
              styles.rsvpBtn,
              rsvp === "attending"
                ? { backgroundColor: theme.primary }
                : { borderWidth: 1.5, borderColor: theme.primary },
            ]}
          >
            <Ionicons
              name={rsvp === "attending" ? "checkmark-circle" : "calendar-outline"}
              size={15}
              color={rsvp === "attending" ? "#fff" : theme.primary}
            />
            <Text
              style={[
                styles.rsvpText,
                { color: rsvp === "attending" ? "#fff" : theme.primary },
              ]}
            >
              {rsvp === "attending" ? "Attending ✓" : "Attend"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setRsvp(rsvp === "interested" ? null : "interested")}
            style={[
              styles.rsvpBtnSecondary,
              {
                backgroundColor: rsvp === "interested" ? theme.primaryLight : theme.surfaceSecondary,
              },
            ]}
          >
            <Ionicons
              name="star-outline"
              size={15}
              color={rsvp === "interested" ? theme.primary : theme.textSecondary}
            />
            <Text
              style={[
                styles.rsvpTextSecondary,
                { color: rsvp === "interested" ? theme.primary : theme.textSecondary },
              ]}
            >
              Interested
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="share-outline" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  coverContainer: { position: "relative", height: 180 },
  cover: { width: "100%", height: "100%" },
  coverGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: 80 },
  liveBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  liveText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  featuredText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  coverDateBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: "center",
  },
  coverDay: { fontSize: 16, fontWeight: "800", color: "#111" },
  coverMonth: { fontSize: 10, fontWeight: "600", color: "#555", textTransform: "uppercase" },
  coverCat: {
    position: "absolute",
    bottom: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  coverCatText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  body: { padding: 14, gap: 8 },
  title: { fontSize: 15, fontWeight: "700", lineHeight: 21 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, flex: 1 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#999", marginHorizontal: 2 },
  statsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  attendeeAvatars: { flexDirection: "row", alignItems: "center", gap: 6 },
  microAvatar: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: "#fff" },
  attendeeCount: { fontSize: 12, fontWeight: "500" },
  capacity: { fontSize: 11 },
  rsvpRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  rsvpBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  rsvpText: { fontSize: 13, fontWeight: "700" },
  rsvpBtnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  rsvpTextSecondary: { fontSize: 13, fontWeight: "600" },
  shareBtn: { padding: 8 },
  // Compact styles
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  compactDate: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  compactDay: { fontSize: 17, fontWeight: "800" },
  compactMonth: { fontSize: 10, fontWeight: "600", textTransform: "uppercase" },
  compactContent: { flex: 1 },
  compactTitle: { fontSize: 13, fontWeight: "600", marginBottom: 3 },
  compactLocation: { fontSize: 11, marginBottom: 5 },
  compactMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  catBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  catText: { fontSize: 10, fontWeight: "600" },
  attendees: { fontSize: 11 },
});

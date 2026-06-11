import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import {
  MapPinIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  BellIcon,
  CheckCircleIcon,
} from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "@/contexts/LocationContext";

const TN_DISTRICTS = [
  { district: "Coimbatore",      constituencies: ["Coimbatore North", "Coimbatore South", "Singanallur", "Kinathukadavu", "Pollachi"] },
  { district: "Chennai",         constituencies: ["Chennai Central", "Chennai North", "Chennai South", "Egmore", "Royapuram"] },
  { district: "Madurai",         constituencies: ["Madurai East", "Madurai West", "Madurai Central", "Madurai North", "Madurai South"] },
  { district: "Salem",           constituencies: ["Salem", "Omalur", "Edappadi", "Mettur", "Dharmapuri"] },
  { district: "Tirunelveli",     constituencies: ["Tirunelveli", "Ambasamudram", "Nanguneri", "Radhapuram"] },
  { district: "Tiruchirappalli", constituencies: ["Srirangam", "Tiruchirappalli West", "Tiruchirappalli East"] },
];

interface Props {
  onNotificationsPress?: () => void;
  unreadCount?: number;
}

export default function LocationHeader({ onNotificationsPress, unreadCount = 0 }: Props) {
  const { theme } = useTheme();
  const { location, setLocation } = useLocation();
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(
    TN_DISTRICTS.find((d) => d.district === location.district) ?? TN_DISTRICTS[0]
  );

  return (
    <>
      {/* ── Header bar ── */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
            paddingTop: insets.top + 4,
          },
        ]}
      >
        <View style={styles.left}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>AN</Text>
          </View>
          <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.8}>
            <View style={styles.locationRow}>
              <MapPinIcon size={13} color={theme.primary} />
              <Text style={[styles.locationPrimary, { color: theme.textPrimary }]}>
                {location.constituency}
              </Text>
              <ChevronDownIcon size={13} color={theme.textSecondary} />
            </View>
            <Text style={[styles.locationSub, { color: theme.textTertiary }]}>
              {location.district} · {location.state}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MagnifyingGlassIcon size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onNotificationsPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <BellIcon size={22} color={theme.textPrimary} />
            {unreadCount > 0 && (
              <View style={[styles.notifBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Location picker — constrained to 390px via Modal centering ── */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
        statusBarTranslucent
      >
        {/* Full-screen backdrop + centering wrapper */}
        <View style={styles.modalWrapper}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setShowModal(false)} />

          {/* Sheet constrained to 390px, centered */}
          <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
            <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
            <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>
              Select Your Location
            </Text>
            <Text style={[styles.sheetSub, { color: theme.textSecondary }]}>
              Tamil Nadu · Content is personalised to your area
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {TN_DISTRICTS.map((d) => (
                <View key={d.district}>
                  <TouchableOpacity
                    style={[
                      styles.districtRow,
                      selectedDistrict.district === d.district && {
                        backgroundColor: theme.primaryLight,
                      },
                    ]}
                    onPress={() => setSelectedDistrict(d)}
                  >
                    {selectedDistrict.district === d.district
                      ? <ChevronDownIcon size={16} color={theme.primary} />
                      : <ChevronRightIcon size={16} color={theme.textTertiary} />}
                    <Text
                      style={[
                        styles.districtName,
                        {
                          color: selectedDistrict.district === d.district ? theme.primary : theme.textPrimary,
                          fontWeight: selectedDistrict.district === d.district ? "700" : "500",
                        },
                      ]}
                    >
                      {d.district} District
                    </Text>
                  </TouchableOpacity>

                  {selectedDistrict.district === d.district &&
                    d.constituencies.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[
                          styles.constituencyRow,
                          location.constituency === c && { backgroundColor: theme.primaryLight },
                        ]}
                        onPress={() => {
                          setLocation({ state: "Tamil Nadu", district: d.district, constituency: c });
                          setShowModal(false);
                        }}
                      >
                        <View
                          style={[
                            styles.constituencyDot,
                            { backgroundColor: location.constituency === c ? theme.primary : theme.border },
                          ]}
                        />
                        <Text
                          style={[
                            styles.constituencyName,
                            {
                              color: location.constituency === c ? theme.primary : theme.textSecondary,
                              fontWeight: location.constituency === c ? "600" : "400",
                            },
                          ]}
                        >
                          {c}
                        </Text>
                        {location.constituency === c && (
                          <CheckCircleIcon size={16} color={theme.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoMark: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#2563EB",
    borderWidth: 2, borderColor: "#EAB308",   // yellow border on blue logo
  },
  logoText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  locationPrimary: { fontSize: 15, fontWeight: "700" },
  locationSub: { fontSize: 11, marginTop: 1 },
  actions: { flexDirection: "row", gap: 4 },
  iconBtn: { padding: 6, position: "relative" },
  notifBadge: {
    position: "absolute", top: 2, right: 2,
    width: 16, height: 16, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },

  // Modal — full viewport backdrop, sheet centered at max 390px
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    width: "100%",
    maxWidth: 390,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  sheetSub: { fontSize: 12, marginBottom: 16 },
  districtRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 12, paddingHorizontal: 8, borderRadius: 10,
  },
  districtName: { fontSize: 14 },
  constituencyRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 10, paddingHorizontal: 32, borderRadius: 10,
  },
  constituencyDot: { width: 8, height: 8, borderRadius: 4 },
  constituencyName: { flex: 1, fontSize: 13 },
});

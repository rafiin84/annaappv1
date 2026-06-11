import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";

const { height: H } = Dimensions.get("window");
const ANNAMALAI_PHOTO = require("../../assets/leader.jpeg");

interface Props {
  onDone: () => void;
}

export default function AppSplash({ onDone }: Props) {
  const { loginAsVolunteer } = useAuth();
  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleAnim, { toValue: 1, duration: 700, delay: 400, useNativeDriver: true }),
        Animated.timing(titleSlide, { toValue: 0, duration: 700, delay: 400, useNativeDriver: true }),
      ]),
      Animated.timing(btnAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleVolunteer = () => {
    setShowSheet(false);
    loginAsVolunteer();
    onDone();
  };

  const handleSupporter = () => {
    setShowSheet(false);
    // onDone reveals RootNavigator → LoginScreen (isAuthenticated is still false)
    onDone();
  };

  return (
    <View style={styles.root}>
      {/* Full-bleed Annamalai photo */}
      <Image source={ANNAMALAI_PHOTO} style={styles.photo} resizeMode="cover" />

      {/* Gradient overlay */}
      <View style={styles.overlay} />

      {/* Bottom content */}
      <Animated.View
        style={[
          styles.bottom,
          { opacity: titleAnim, transform: [{ translateY: titleSlide }] },
        ]}
      >
        <Text style={styles.appName}>Anna</Text>
        <Text style={styles.tagline}>A common man in search of good politics</Text>
        <View style={styles.dot} />

        <Animated.View style={{ opacity: btnAnim, width: "100%" }}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => setShowSheet(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Role-selector bottom sheet */}
      <Modal
        visible={showSheet}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setShowSheet(false)}
        >
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={styles.handle} />

            <Text style={styles.sheetTitle}>Continue as</Text>

            {/* Volunteer */}
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={handleVolunteer}
              activeOpacity={0.75}
            >
              <View style={[styles.optionIcon, { backgroundColor: "#EAB30820" }]}>
                <Text style={styles.optionEmoji}>🙋</Text>
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: "#B45309" }]}>Volunteer</Text>
                <Text style={styles.optionSub}>Party worker · Booth-level activist</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Supporter */}
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={handleSupporter}
              activeOpacity={0.75}
            >
              <View style={[styles.optionIcon, { backgroundColor: "#2563EB20" }]}>
                <Text style={styles.optionEmoji}>🤝</Text>
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: "#1D4ED8" }]}>Supporter</Text>
                <Text style={styles.optionSub}>Citizen who supports the movement</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowSheet(false)}
              activeOpacity={0.75}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 999,
    backgroundColor: "#0A1628",
  },
  photo: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(10,22,40,0.7) 55%, rgba(10,22,40,0.97) 100%)",
  } as any,
  bottom: {
    position: "absolute",
    bottom: 56,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  appName: {
    fontSize: 60,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#EAB308",
    marginTop: 16,
    marginBottom: 28,
  },
  loginBtn: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: "#EAB308",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EAB308",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  loginBtnText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1C1917",
    letterSpacing: 0.5,
  },

  // Bottom sheet
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    gap: 14,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  optionEmoji: { fontSize: 22 },
  optionText: { flex: 1 },
  optionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
  },
  optionSub: {
    fontSize: 13,
    color: "#6B7280",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
  cancelBtn: {
    marginTop: 12,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});

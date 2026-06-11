import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Dimensions } from "react-native";

const { width: W, height: H } = Dimensions.get("window");

const ANNAMALAI_PHOTO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/K._Annamalai_at_padayatra.jpg/250px-K._Annamalai_at_padayatra.jpg";

interface Props {
  onDone: () => void;
}

export default function AppSplash({ onDone }: Props) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Title fades in
    Animated.parallel([
      Animated.timing(titleAnim, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
      Animated.timing(titleSlide, { toValue: 0, duration: 600, delay: 300, useNativeDriver: true }),
    ]).start();

    // Fade out and dismiss after 2.4s
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() =>
        onDone()
      );
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      {/* Full-bleed photo */}
      <Image
        source={{ uri: ANNAMALAI_PHOTO }}
        style={styles.photo}
        resizeMode="cover"
      />

      {/* Dark gradient overlay */}
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
      </Animated.View>
    </Animated.View>
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
    backgroundColor: "transparent",
    // gradient simulation: strong at bottom, light at top
    backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,22,40,0.85) 65%, rgba(10,22,40,1) 100%)",
  } as any,
  bottom: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  appName: {
    fontSize: 56,
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
    marginTop: 20,
  },
});

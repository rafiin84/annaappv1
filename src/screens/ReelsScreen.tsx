import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Reel } from "@/types";
import { MOCK_REELS, formatCount } from "@/data/mockData";
import { palette } from "@/theme/colors";
import { useTheme } from "@/contexts/ThemeContext";

const { width: W, height: H } = Dimensions.get("window");

function ReelItem({ reel, isActive }: { reel: Reel; isActive: boolean }) {
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(reel.liked);
  const [likeCount, setLikeCount] = useState(reel.stats.likes);
  const [following, setFollowing] = useState(reel.following);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const heartAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const handleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => liked ? c - 1 : c + 1);
    Animated.sequence([
      Animated.timing(heartAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(heartAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const captionShort = reel.caption.length > 100;
  const displayCaption = captionShort && !captionExpanded
    ? reel.caption.slice(0, 100) + "..."
    : reel.caption;

  return (
    <View style={styles.reelContainer}>
      {/* Background thumbnail (acts as video placeholder) */}
      <Image
        source={{ uri: reel.thumbnailUrl }}
        style={styles.reelBg}
        resizeMode="cover"
      />

      {/* Gradient overlays */}
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "transparent"]}
        style={styles.topGrad}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.85)"]}
        style={styles.bottomGrad}
        pointerEvents="none"
      />

      {/* Progress bar */}
      <View style={[styles.progressBar, { top: insets.top + 8 }]}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: isActive ? "65%" : "0%" },
            ]}
          />
        </View>
      </View>

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.reelsTitle}>Reels</Text>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="camera-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Right actions */}
      <View style={[styles.rightActions, { bottom: insets.bottom + 100 }]}>
        {/* Author avatar */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: reel.author.avatar }} style={styles.avatar} />
          <TouchableOpacity
            onPress={() => setFollowing((v) => !v)}
            style={[styles.followBtn, { backgroundColor: following ? "transparent" : palette.saffron[500] }]}
          >
            <Ionicons
              name={following ? "checkmark" : "add"}
              size={12}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <ActionButton
          icon={liked ? "heart" : "heart-outline"}
          count={formatCount(likeCount)}
          color={liked ? "#EF4444" : "#fff"}
          onPress={handleLike}
        />
        <ActionButton
          icon="chatbubble-outline"
          count={formatCount(reel.stats.comments)}
          color="#fff"
          onPress={() => {}}
        />
        <ActionButton
          icon="paper-plane-outline"
          count={formatCount(reel.stats.shares)}
          color="#fff"
          onPress={() => {}}
        />
        <ActionButton
          icon="bookmark-outline"
          count=""
          color="#fff"
          onPress={() => {}}
        />
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Music disc */}
        {reel.music && (
          <View style={styles.musicDisc}>
            <Image source={{ uri: reel.author.avatar }} style={styles.musicDiscImg} />
          </View>
        )}
      </View>

      {/* Bottom info */}
      <View style={[styles.bottomInfo, { paddingBottom: insets.bottom + 90 }]}>
        <View style={styles.authorRow}>
          <Text style={styles.authorName}>{reel.author.name}</Text>
          {reel.author.isVerified && (
            <Ionicons name="checkmark-circle" size={15} color={palette.saffron[400]} />
          )}
          <TouchableOpacity
            onPress={() => setFollowing((v) => !v)}
            style={[
              styles.inlineFollow,
              { borderColor: following ? "transparent" : "#fff", backgroundColor: following ? "rgba(255,255,255,0.15)" : "transparent" },
            ]}
          >
            <Text style={styles.inlineFollowText}>{following ? "Following" : "Follow"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setCaptionExpanded((v) => !v)}>
          <Text style={styles.caption}>
            {displayCaption}
            {captionShort && !captionExpanded && (
              <Text style={{ color: "rgba(255,255,255,0.7)" }}> more</Text>
            )}
          </Text>
        </TouchableOpacity>

        {/* Hashtags */}
        <View style={styles.hashtagRow}>
          {reel.hashtags.map((tag) => (
            <Text key={tag} style={styles.hashtag}>#{tag} </Text>
          ))}
        </View>

        {/* Location + views */}
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.7)" />
          <Text style={styles.metaText}>{reel.location.label || reel.location.constituency}</Text>
          <View style={styles.dot} />
          <Ionicons name="eye-outline" size={13} color="rgba(255,255,255,0.7)" />
          <Text style={styles.metaText}>{formatCount(reel.stats.views)} views</Text>
        </View>

        {/* Music */}
        {reel.music && (
          <View style={styles.musicRow}>
            <Ionicons name="musical-notes" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={styles.musicText}>{reel.music}</Text>
          </View>
        )}
      </View>

      {/* Double tap heart animation */}
      <Animated.View
        style={[
          styles.heartOverlay,
          {
            opacity: heartAnim,
            transform: [{ scale: heartAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.5] }) }],
          },
        ]}
        pointerEvents="none"
      >
        <Ionicons name="heart" size={80} color="#EF4444" />
      </Animated.View>
    </View>
  );
}

function ActionButton({
  icon, count, color, onPress,
}: { icon: string; count: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Ionicons name={icon as any} size={28} color={color} />
      {count !== "" && <Text style={styles.actionCount}>{count}</Text>}
    </TouchableOpacity>
  );
}

export default function ReelsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isDark } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: "#000" }]}>
      <FlatList
        data={MOCK_REELS}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ReelItem reel={item} isActive={index === activeIndex} />
        )}
        pagingEnabled
        vertical
        showsVerticalScrollIndicator={false}
        snapToInterval={H}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.y / H);
          setActiveIndex(idx);
        }}
        getItemLayout={(_, index) => ({ length: H, offset: H * index, index })}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  reelContainer: { width: W, height: H, position: "relative" },
  reelBg: { ...StyleSheet.absoluteFillObject, width: W, height: H },
  topGrad: { position: "absolute", top: 0, left: 0, right: 0, height: 200 },
  bottomGrad: { position: "absolute", bottom: 0, left: 0, right: 0, height: 400 },
  progressBar: { position: "absolute", left: 16, right: 16 },
  progressTrack: { height: 2, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 1 },
  progressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 1 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  reelsTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  rightActions: {
    position: "absolute",
    right: 12,
    alignItems: "center",
    gap: 18,
  },
  avatarWrapper: { position: "relative", marginBottom: 4 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: "#fff" },
  followBtn: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    marginLeft: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: palette.saffron[500],
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#000",
  },
  actionBtn: { alignItems: "center", gap: 4 },
  actionCount: { color: "#fff", fontSize: 12, fontWeight: "700" },
  moreBtn: { marginTop: -8 },
  musicDisc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
    marginTop: 4,
  },
  musicDiscImg: { width: "100%", height: "100%", borderRadius: 20 },
  bottomInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 72,
    paddingHorizontal: 16,
    gap: 6,
  },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  authorName: { color: "#fff", fontSize: 15, fontWeight: "700" },
  inlineFollow: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  inlineFollowText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  caption: { color: "#fff", fontSize: 13, lineHeight: 18 },
  hashtagRow: { flexDirection: "row", flexWrap: "wrap" },
  hashtag: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: "600" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "rgba(255,255,255,0.5)" },
  musicRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  musicText: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  heartOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
});

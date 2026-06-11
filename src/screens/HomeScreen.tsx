import React, { useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  PlusCircleIcon, Bars3Icon, CalendarDaysIcon, MegaphoneIcon, XMarkIcon,
  PhotoIcon, VideoCameraIcon,
} from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "@/contexts/LocationContext";
import { useScroll } from "@/contexts/ScrollContext";
import StoryBar from "@/components/StoryBar";
import FeedPost from "@/components/FeedPost";
import EventCard from "@/components/EventCard";
import { MOCK_POSTS, MOCK_STORIES, MOCK_EVENTS, CURRENT_USER } from "@/data/mockData";

type PostLike = (typeof MOCK_POSTS)[0];

type FeedItem =
  | { type: "stories" }
  | { type: "post"; data: PostLike }
  | { type: "event_inline"; data: (typeof MOCK_EVENTS)[0] }
  | { type: "section_header"; title: string; subtitle?: string }
  | { type: "leader_cta" };

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const { crmUser } = useAuth();
  const { location } = useLocation();
  const { setScrolledDown } = useScroll();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const lastScrollY = useRef(0);
  const [addPostOpen, setAddPostOpen] = useState(false);
  const [userPosts, setUserPosts] = useState<PostLike[]>([]);

  const onScroll = useCallback((e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    setScrolledDown(y > lastScrollY.current && y > 60);
    lastScrollY.current = y;
  }, []);

  const handleNewPost = useCallback((post: PostLike) => {
    setUserPosts((prev) => [post, ...prev]);
    setAddPostOpen(false);
  }, []);

  const feedItems: FeedItem[] = [
    { type: "stories" },
    // User-created posts appear first
    ...userPosts.map((p) => ({ type: "post" as const, data: p })),
    { type: "post", data: MOCK_POSTS[1] },
    { type: "post", data: MOCK_POSTS[2] },
    { type: "event_inline", data: MOCK_EVENTS[0] },
    { type: "post", data: MOCK_POSTS[5] },
    { type: "post", data: MOCK_POSTS[9] },
    { type: "section_header", title: `🌆 ${location.district} District` },
    { type: "post", data: MOCK_POSTS[3] },
    { type: "post", data: MOCK_POSTS[10] },
    { type: "post", data: MOCK_POSTS[4] },
    { type: "event_inline", data: MOCK_EVENTS[1] },
    { type: "leader_cta" },
    { type: "section_header", title: "📣 State Updates" },
    { type: "post", data: MOCK_POSTS[0] },
    { type: "post", data: MOCK_POSTS[11] },
    { type: "post", data: MOCK_POSTS[6] },
    { type: "post", data: MOCK_POSTS[12] },
    { type: "post", data: MOCK_POSTS[7] },
    { type: "post", data: MOCK_POSTS[13] },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => {
      if (item.type === "stories") {
        return (
          <StoryBar
            stories={MOCK_STORIES}
            onStoryPress={() => {}}
            onAddStory={() => {}}
          />
        );
      }
      if (item.type === "section_header") {
        return (
          <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
            <View style={styles.sectionAccent} />
            <View>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              {item.subtitle && (
                <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>{item.subtitle}</Text>
              )}
            </View>
          </View>
        );
      }
      if (item.type === "post") {
        return <FeedPost post={item.data} />;
      }
      if (item.type === "event_inline") {
        return (
          <View style={styles.eventInline}>
            <View style={styles.eventInlineLabel}>
              <CalendarDaysIcon size={12} color={theme.primary} />
              <Text style={[styles.eventInlineLabelText, { color: theme.primary }]}>Event near you</Text>
            </View>
            <EventCard event={item.data} compact />
          </View>
        );
      }
      if (item.type === "leader_cta") {
        return <LeaderCTA theme={theme} />;
      }
      return null;
    },
    [theme]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={() => setAddPostOpen(true)}>
          <PlusCircleIcon size={26} color={theme.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Anna</Text>
          {!!crmUser?.full_name && (
            <Text style={[styles.headerUser, { color: theme.textSecondary }]}>
              {crmUser.full_name}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Bars3Icon size={26} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <FlatList
        data={feedItems}
        keyExtractor={(item, index) => {
          if (item.type === "post") return `post-${item.data.id}`;
          if (item.type === "event_inline") return `event-${item.data.id}`;
          return `${item.type}-${index}`;
        }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        removeClippedSubviews
        maxToRenderPerBatch={8}
        windowSize={10}
      />

      {/* Add Post Modal */}
      <AddPostModal
        visible={addPostOpen}
        onClose={() => setAddPostOpen(false)}
        onPost={handleNewPost}
        theme={theme}
        isDark={isDark}
        location={location}
      />
    </View>
  );
}

// ─── Add Post Modal ────────────────────────────────────────────────────────────

type MediaItem = { url: string; type: "image" | "video" };

function AddPostModal({
  visible, onClose, onPost, theme, isDark, location,
}: {
  visible: boolean;
  onClose: () => void;
  onPost: (post: any) => void;
  theme: any;
  isDark: boolean;
  location: any;
}) {
  const [text, setText] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;

  const pickMedia = (type: "image" | "video") => {
    if (Platform.OS === "web") {
      const input = document.createElement("input") as HTMLInputElement;
      input.type = "file";
      input.accept = type === "image" ? "image/*" : "video/*";
      input.multiple = true;
      input.onchange = (e: Event) => {
        const files = Array.from((e.target as HTMLInputElement).files ?? []);
        const urls = files.map((f) => URL.createObjectURL(f));
        setMedia((prev) => [...prev, ...urls.map((url) => ({ url, type }))]);
      };
      input.click();
    }
  };

  const removeMedia = (idx: number) =>
    setMedia((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!text.trim() && media.length === 0) return;
    const tags = hashtags
      .split(/[\s,#]+/)
      .filter(Boolean)
      .map((t) => t.replace(/^#/, ""));

    const newPost: any = {
      id: `user_${Date.now()}`,
      type: media.length > 0 ? "image" : "text",
      author: {
        id: CURRENT_USER.id,
        name: CURRENT_USER.name,
        avatar: CURRENT_USER.avatar,
        isVerified: CURRENT_USER.isVerified,
        isLeader: CURRENT_USER.isLeader,
        role: CURRENT_USER.role,
      },
      content: text.trim(),
      media: media.map((m) => ({ type: m.type, url: m.url, aspectRatio: 1.5 })),
      location: {
        state: location.state,
        district: location.district,
        constituency: location.constituency,
        label: location.constituency,
      },
      hashtags: tags,
      mentions: [],
      stats: { likes: 0, comments: 0, shares: 0, views: 1 },
      liked: false,
      saved: false,
      shared: false,
      isPinned: false,
      isAnnouncement: false,
      createdAt: new Date().toISOString(),
    };
    onPost(newPost);
    setText("");
    setHashtags("");
    setMedia([]);
  };

  const canPost = text.trim().length > 0 || media.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isDesktop ? "fade" : "slide"}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={[styles.modalWrap, isDesktop && styles.modalWrapDesktop]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />

        <View
          style={[
            styles.modalCard,
            isDesktop ? styles.modalCardDesktop : styles.modalCardMobile,
            {
              backgroundColor: theme.surface,
              paddingBottom: isDesktop ? 20 : insets.bottom + 16,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <XMarkIcon size={22} color={theme.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>New Post</Text>
            <TouchableOpacity
              style={[styles.postBtn, { backgroundColor: canPost ? theme.primary : theme.border }]}
              onPress={handleSubmit}
              disabled={!canPost}
            >
              <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Author row */}
            <View style={styles.authorRow}>
              <Image source={{ uri: CURRENT_USER.avatar }} style={styles.authorAvatar} />
              <View>
                <Text style={[styles.authorName, { color: theme.textPrimary }]}>{CURRENT_USER.name}</Text>
                <Text style={[styles.authorLocation, { color: theme.textSecondary }]}>
                  📍 {location.constituency}
                </Text>
              </View>
            </View>

            {/* Text input */}
            <TextInput
              style={[styles.contentInput, { color: theme.textPrimary }]}
              placeholder="What's happening in your constituency?"
              placeholderTextColor={theme.textTertiary}
              multiline
              maxLength={500}
              value={text}
              onChangeText={setText}
              autoFocus
            />

            {/* Media thumbnails */}
            {media.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbsRow}
              >
                {media.map((m, i) => (
                  <View key={i} style={styles.thumbWrap}>
                    <Image source={{ uri: m.url }} style={styles.thumbImage} resizeMode="cover" />
                    {m.type === "video" && (
                      <View style={styles.videoOverlay}>
                        <Text style={styles.videoLabel}>▶</Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.removeThumb} onPress={() => removeMedia(i)}>
                      <XMarkIcon size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                {/* Add more */}
                <TouchableOpacity
                  style={[styles.addMoreThumb, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary }]}
                  onPress={() => pickMedia("image")}
                >
                  <PhotoIcon size={20} color={theme.textSecondary} />
                  <Text style={[styles.addMoreText, { color: theme.textSecondary }]}>Add</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {/* Hashtags */}
            <View style={[styles.hashtagRow, { borderTopColor: theme.border }]}>
              <Text style={[styles.hashtagLabel, { color: theme.textSecondary }]}>#</Text>
              <TextInput
                style={[styles.hashtagInput, { color: theme.textPrimary }]}
                placeholder="Add hashtags  (WeTheLeaders, CoimbatoreNorth…)"
                placeholderTextColor={theme.textTertiary}
                value={hashtags}
                onChangeText={setHashtags}
                returnKeyType="done"
              />
            </View>
          </ScrollView>

          {/* Bottom action bar */}
          <View style={[styles.actionBar, { borderTopColor: theme.border }]}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => pickMedia("image")} activeOpacity={0.7}>
              <PhotoIcon size={22} color={theme.primary} />
              <Text style={[styles.actionBtnText, { color: theme.primary }]}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => pickMedia("video")} activeOpacity={0.7}>
              <VideoCameraIcon size={22} color="#7C3AED" />
              <Text style={[styles.actionBtnText, { color: "#7C3AED" }]}>Video</Text>
            </TouchableOpacity>
            <Text style={[styles.charCount, { color: text.length > 450 ? "#EF4444" : theme.textTertiary, marginLeft: "auto" as any }]}>
              {text.length}/500
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Leader CTA ───────────────────────────────────────────────────────────────

function LeaderCTA({ theme }: { theme: any }) {
  return (
    <View style={[styles.leaderCTA, { backgroundColor: theme.primary + "12", borderColor: theme.primary + "30" }]}>
      <View style={styles.leaderCTAIcon}>
        <MegaphoneIcon size={24} color={theme.primary} />
      </View>
      <View style={styles.leaderCTAContent}>
        <Text style={[styles.leaderCTATitle, { color: theme.textPrimary }]}>Follow your leaders</Text>
        <Text style={[styles.leaderCTASub, { color: theme.textSecondary }]}>
          Get direct updates from Annamalai and your local leaders
        </Text>
      </View>
      <TouchableOpacity style={[styles.leaderCTABtn, { backgroundColor: theme.primary }]}>
        <Text style={styles.leaderCTABtnText}>Follow</Text>
      </TouchableOpacity>
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
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  headerUser: { fontSize: 11, fontWeight: "500", marginTop: 1 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionAccent: { width: 4, height: 20, borderRadius: 2, backgroundColor: "#EAB308" },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  sectionSub: { fontSize: 12, marginTop: 2 },

  eventInline: { marginTop: 4 },
  eventInlineLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  eventInlineLabelText: { fontSize: 11, fontWeight: "600" },

  leaderCTA: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leaderCTAIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(37,99,235,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  leaderCTAContent: { flex: 1 },
  leaderCTATitle: { fontSize: 14, fontWeight: "700" },
  leaderCTASub: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  leaderCTABtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  leaderCTABtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },

  // Modal
  modalWrap: { flex: 1, justifyContent: "flex-end" },
  modalWrapDesktop: { justifyContent: "center", alignItems: "center" },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  modalCard: { minHeight: 360, maxHeight: "88%" as any },
  modalCardMobile: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalCardDesktop: {
    width: 500,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalCloseBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  modalTitle: { fontSize: 16, fontWeight: "700" },
  postBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  postBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  authorAvatar: { width: 40, height: 40, borderRadius: 20 },
  authorName: { fontSize: 14, fontWeight: "700" },
  authorLocation: { fontSize: 11, marginTop: 1 },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  thumbsRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  thumbWrap: { width: 80, height: 80, borderRadius: 10, overflow: "hidden", position: "relative" },
  thumbImage: { width: "100%", height: "100%" },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoLabel: { color: "#fff", fontSize: 20 },
  removeThumb: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  addMoreThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  addMoreText: { fontSize: 11, fontWeight: "600" },
  hashtagRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
    gap: 6,
  },
  hashtagLabel: { fontSize: 18, fontWeight: "700" },
  hashtagInput: { flex: 1, fontSize: 14 },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnText: { fontSize: 13, fontWeight: "600" },
  charCount: { fontSize: 11, paddingHorizontal: 4 },
});

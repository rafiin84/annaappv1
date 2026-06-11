import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  EllipsisHorizontalIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  RocketLaunchIcon,
  BookmarkIcon as BookmarkOutlineIcon,
  HeartIcon as HeartOutlineIcon,
} from "react-native-heroicons/outline";
import {
  CheckCircleIcon,
  HeartIcon,
  BookmarkIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  MegaphoneIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";

import { Post } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { palette } from "@/theme/colors";
import { formatTimeAgo, formatCount } from "@/data/mockData";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Props {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onProfile?: (userId: string) => void;
}

export default function FeedPost({ post, onLike, onComment, onShare, onSave, onProfile }: Props) {
  const { theme, isDark } = useTheme();
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.stats.likes);
  const [saved, setSaved] = useState(post.saved);
  const [expanded, setExpanded] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,   duration: 80, useNativeDriver: true }),
    ]).start();
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => wasLiked ? c - 1 : c + 1);
    onLike?.(post.id);
  };

  const isLong = post.content.length > 180;
  const displayContent = isLong && !expanded ? post.content.slice(0, 180) + "..." : post.content;

  type TypeConfigEntry = { label: string; color: string; Icon: React.ComponentType<any> };
  const typeConfig: Record<string, TypeConfigEntry> = {
    announcement: { label: "Announcement", color: palette.saffron[500],  Icon: MegaphoneIcon },
    campaign:      { label: "Campaign",     color: "#8B5CF6",             Icon: RocketLaunchIcon },
    issue_report:  { label: "Local Issue",  color: palette.red[500],      Icon: ExclamationTriangleIcon },
    achievement:   { label: "Achievement",  color: palette.gold[500],     Icon: TrophyIcon },
  };
  const typeInfo = typeConfig[post.type];

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      {/* Pinned Banner */}
      {post.isPinned && (
        <View style={[styles.pinnedBanner, { backgroundColor: theme.primaryLight }]}>
          <MapPinIcon size={12} color={theme.primary} />
          <Text style={[styles.pinnedText, { color: theme.primary }]}>Pinned Post</Text>
        </View>
      )}

      {/* Type Badge */}
      {typeInfo && (
        <View style={[styles.typeBadge, { backgroundColor: typeInfo.color + "18" }]}>
          <typeInfo.Icon size={12} color={typeInfo.color} />
          <Text style={[styles.typeBadgeText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.authorRow} onPress={() => onProfile?.(post.author.id)}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
            {post.author.isLeader && (
              <View style={[styles.leaderDot, { backgroundColor: palette.gold[500] }]} />
            )}
          </View>
          <View style={styles.authorInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.authorName, { color: theme.textPrimary }]}>{post.author.name}</Text>
              {post.author.isVerified && (
                <CheckCircleIcon size={15} color={theme.primary} style={{ marginLeft: 3 }} />
              )}
              {post.author.isLeader && (
                <View style={[styles.roleBadge, { backgroundColor: palette.gold[500] + "20" }]}>
                  <Text style={[styles.roleText, { color: palette.gold[600] }]}>Leader</Text>
                </View>
              )}
            </View>
            <Text style={[styles.metaText, { color: theme.textTertiary }]}>
              📍 {post.location.label || post.location.constituency || post.location.district} · {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <EllipsisHorizontalIcon size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <TouchableOpacity onPress={() => isLong && setExpanded(!expanded)} activeOpacity={0.95}>
        <Text style={[styles.content, { color: theme.textPrimary }]}>
          {displayContent}
          {isLong && !expanded && (
            <Text style={{ color: theme.primary }}> more</Text>
          )}
        </Text>
      </TouchableOpacity>

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <View style={styles.hashtagRow}>
          {post.hashtags.slice(0, 3).map((tag) => (
            <TouchableOpacity key={tag}>
              <Text style={[styles.hashtag, { color: theme.primary }]}>#{tag} </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <View style={styles.mediaContainer}>
          {post.media.length === 1 ? (
            <Image
              source={{ uri: post.media[0].url }}
              style={[styles.singleImage, { aspectRatio: post.media[0].aspectRatio || 1.5 }]}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.multiImageGrid}>
              {post.media.slice(0, 2).map((m, i) => (
                <Image key={i} source={{ uri: m.url }} style={styles.gridImage} resizeMode="cover" />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Poll */}
      {post.poll && (
        <View style={[styles.pollContainer, { borderColor: theme.border }]}>
          <Text style={[styles.pollQuestion, { color: theme.textPrimary }]}>{post.poll.question}</Text>
          {post.poll.options.map((option) => {
            const pct = Math.round((option.votes / post.poll!.totalVotes) * 100);
            const isVoted = post.poll!.userVote === option.id;
            return (
              <View key={option.id} style={[styles.pollOption, { borderColor: isVoted ? theme.primary : theme.border }]}>
                <View
                  style={[
                    styles.pollBar,
                    {
                      width: `${pct}%` as any,
                      backgroundColor: isVoted ? theme.primary + "25" : theme.surfaceSecondary,
                    },
                  ]}
                />
                <Text style={[styles.pollOptionText, { color: isVoted ? theme.primary : theme.textPrimary }]}>
                  {option.text}
                </Text>
                <Text style={[styles.pollPct, { color: isVoted ? theme.primary : theme.textSecondary }]}>
                  {pct}%
                </Text>
              </View>
            );
          })}
          <Text style={[styles.pollMeta, { color: theme.textTertiary }]}>
            {formatCount(post.poll.totalVotes)} votes · Ends {new Date(post.poll.endsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </Text>
        </View>
      )}

      {/* Campaign Progress */}
      {post.campaign && (
        <View style={[styles.campaignContainer, { backgroundColor: theme.primaryLight, borderColor: theme.primary + "30" }]}>
          <View style={styles.campaignHeader}>
            <RocketLaunchIcon size={16} color={theme.primary} />
            <Text style={[styles.campaignTitle, { color: theme.primary }]}>{post.campaign.title}</Text>
          </View>
          <View style={[styles.progressBg, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, (post.campaign.progress / post.campaign.target) * 100)}%` as any,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressText, { color: theme.primary }]}>
              {formatCount(post.campaign.progress)} {post.campaign.unit}
            </Text>
            <Text style={[styles.progressTarget, { color: theme.textSecondary }]}>
              Goal: {formatCount(post.campaign.target)}
            </Text>
          </View>
        </View>
      )}

      {/* Stats Bar */}
      <View style={[styles.statsBar, { borderTopColor: theme.divider }]}>
        <Text style={[styles.statsText, { color: theme.textTertiary }]}>
          {formatCount(likeCount)} likes · {formatCount(post.stats.comments)} comments · {formatCount(post.stats.views)} views
        </Text>
      </View>

      {/* Action Bar */}
      <View style={[styles.actionBar, { borderTopColor: theme.divider }]}>
        <TouchableOpacity style={styles.action} onPress={handleLike}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            {liked
              ? <HeartIcon size={22} color={palette.red[500]} />
              : <HeartOutlineIcon size={22} color={theme.textSecondary} />}
          </Animated.View>
          <Text style={[styles.actionText, { color: liked ? palette.red[500] : theme.textSecondary }]}>
            {formatCount(likeCount)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={() => onComment?.(post.id)}>
          <ChatBubbleLeftIcon size={21} color={theme.textSecondary} />
          <Text style={[styles.actionText, { color: theme.textSecondary }]}>
            {formatCount(post.stats.comments)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={() => onShare?.(post.id)}>
          <PaperAirplaneIcon size={22} color={theme.textSecondary} />
          <Text style={[styles.actionText, { color: theme.textSecondary }]}>
            {formatCount(post.stats.shares)}
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={() => { setSaved(!saved); onSave?.(post.id); }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {saved
            ? <BookmarkIcon size={22} color={theme.primary} />
            : <BookmarkOutlineIcon size={22} color={theme.textSecondary} />}
        </TouchableOpacity>
      </View>
    </View>
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
  pinnedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pinnedText: { fontSize: 11, fontWeight: "600" },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginHorizontal: 12,
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  typeBadgeText: { fontSize: 11, fontWeight: "600" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  authorRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  avatarContainer: { position: "relative" },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  leaderDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
  },
  authorInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  authorName: { fontSize: 14, fontWeight: "700" },
  roleBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 3,
  },
  roleText: { fontSize: 9, fontWeight: "700" },
  metaText: { fontSize: 11, marginTop: 2 },
  content: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  hashtagRow: { flexDirection: "row", paddingHorizontal: 12, paddingBottom: 8, flexWrap: "wrap" },
  hashtag: { fontSize: 13, fontWeight: "600" },
  mediaContainer: { marginBottom: 4 },
  singleImage: {
    width: "100%",
    borderRadius: 0,
  },
  multiImageGrid: {
    flexDirection: "row",
    gap: 2,
    height: 200,
  },
  gridImage: { flex: 1, height: 200 },
  pollContainer: {
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  pollQuestion: { fontSize: 13, fontWeight: "600" },
  pollOption: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    overflow: "hidden",
    paddingHorizontal: 12,
  },
  pollBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 8,
  },
  pollOptionText: { flex: 1, fontSize: 13, fontWeight: "500", zIndex: 1 },
  pollPct: { fontSize: 12, fontWeight: "700", zIndex: 1 },
  pollMeta: { fontSize: 11, textAlign: "center" },
  campaignContainer: {
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  campaignHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  campaignTitle: { fontSize: 13, fontWeight: "700" },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  progressText: { fontSize: 12, fontWeight: "700" },
  progressTarget: { fontSize: 12 },
  statsBar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  statsText: { fontSize: 11 },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  action: { flexDirection: "row", alignItems: "center", gap: 5, paddingRight: 12 },
  actionText: { fontSize: 13, fontWeight: "600" },
});

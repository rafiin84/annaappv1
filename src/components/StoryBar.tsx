import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PlusIcon } from "react-native-heroicons/outline";
import { StarIcon } from "react-native-heroicons/solid";

import { Story } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { palette } from "@/theme/colors";
import { CURRENT_USER } from "@/data/mockData";

interface Props {
  stories: Story[];
  onStoryPress: (story: Story, index: number) => void;
  onAddStory?: () => void;
}

export default function StoryBar({ stories, onStoryPress, onAddStory }: Props) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Add Story */}
      <TouchableOpacity style={styles.item} onPress={onAddStory} activeOpacity={0.8}>
        <View style={[styles.addRing, { borderColor: theme.border, backgroundColor: theme.surface }]}>
          <Image
            source={{ uri: CURRENT_USER.avatar }}
            style={styles.avatar}
          />
          <View style={[styles.addIcon, { backgroundColor: theme.primary }]}>
            <PlusIcon size={12} color="#fff" />
          </View>
        </View>
        <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1}>
          Your Story
        </Text>
      </TouchableOpacity>

      {/* Stories */}
      {stories.map((story, index) => {
        const viewed = story.viewedBy.includes("u_self");
        const isLeader = story.user.isLeader;

        return (
          <TouchableOpacity
            key={story.id}
            style={styles.item}
            onPress={() => onStoryPress(story, index)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                viewed
                  ? [theme.border, theme.border]
                  : isLeader
                  ? ["#EAB308", "#2563EB"]          // yellow → blue for leader
                  : ["#2563EB", "#EAB308"]          // blue → yellow for regular
              }
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.ring}
            >
              <View style={[styles.avatarWrapper, { backgroundColor: theme.background }]}>
                <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
                {isLeader && (
                  <View style={[styles.leaderBadge, { backgroundColor: palette.gold[500] }]}>
                    <StarIcon size={7} color="#fff" />
                  </View>
                )}
              </View>
            </LinearGradient>
            <Text
              style={[
                styles.label,
                { color: viewed ? theme.textTertiary : theme.textPrimary },
              ]}
              numberOfLines={1}
            >
              {story.user.name.split(" ")[0]}
            </Text>
            {story.label && (
              <Text style={[styles.sublabel, { color: theme.primary }]} numberOfLines={1}>
                {story.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    flexDirection: "row",
  },
  item: {
    alignItems: "center",
    width: 68,
  },
  ring: {
    width: 66,
    height: 66,
    borderRadius: 33,
    padding: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  addRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 1.5,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 99,
  },
  addIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  leaderBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 5,
    textAlign: "center",
    width: 66,
  },
  sublabel: {
    fontSize: 9,
    fontWeight: "600",
    marginTop: 1,
    textAlign: "center",
  },
});

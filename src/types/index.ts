export type LocationLevel = "constituency" | "district" | "state";

export interface UserLocation {
  state: string;
  district: string;
  constituency: string;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverPhoto?: string;
  bio?: string;
  role: "supporter" | "volunteer" | "leader" | "coordinator" | "admin";
  volunteerLevel: 1 | 2 | 3 | 4 | 5;
  location: UserLocation;
  stats: {
    posts: number;
    followers: number;
    following: number;
    eventsAttended: number;
    issuesReported: number;
    reachScore: number;
  };
  badges: Badge[];
  isVerified: boolean;
  isLeader: boolean;
  joinedAt: string;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  color: string;
  earnedAt: string;
}

export interface Story {
  id: string;
  user: Pick<User, "id" | "name" | "avatar" | "isVerified" | "isLeader">;
  media: {
    type: "image" | "video";
    url: string;
    thumbnail?: string;
  };
  location?: UserLocation;
  duration: number;
  viewedBy: string[];
  createdAt: string;
  expiresAt: string;
  label?: string;
}

export type PostType =
  | "text"
  | "image"
  | "video"
  | "poll"
  | "event_share"
  | "issue_report"
  | "campaign"
  | "announcement"
  | "achievement";

export interface Post {
  id: string;
  type: PostType;
  author: Pick<User, "id" | "name" | "avatar" | "isVerified" | "isLeader" | "role">;
  content: string;
  media?: Array<{
    type: "image" | "video";
    url: string;
    thumbnail?: string;
    aspectRatio?: number;
  }>;
  location: UserLocation & { label?: string };
  hashtags: string[];
  mentions: string[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  liked: boolean;
  saved: boolean;
  shared: boolean;
  isPinned: boolean;
  isAnnouncement: boolean;
  poll?: {
    question: string;
    options: Array<{ id: string; text: string; votes: number }>;
    totalVotes: number;
    userVote?: string;
    endsAt: string;
  };
  campaign?: {
    id: string;
    title: string;
    progress: number;
    target: number;
    unit: string;
  };
  createdAt: string;
}

export interface Reel {
  id: string;
  author: Pick<User, "id" | "name" | "avatar" | "isVerified" | "role">;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  location: UserLocation & { label?: string };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  liked: boolean;
  following: boolean;
  duration: number;
  createdAt: string;
  music?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: "rally" | "training" | "cleanup" | "meeting" | "campaign" | "cultural";
  coverImage: string;
  organizer: Pick<User, "id" | "name" | "avatar" | "isVerified">;
  location: UserLocation & {
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  date: string;
  endDate?: string;
  time: string;
  stats: {
    attending: number;
    interested: number;
    capacity?: number;
  };
  rsvpStatus?: "attending" | "interested" | null;
  tags: string[];
  isLive?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  icon: string;
  level: LocationLevel;
  location: UserLocation;
  stats: {
    members: number;
    posts: number;
    activeToday: number;
  };
  isJoined: boolean;
  isModerator: boolean;
  recentPosts: Pick<Post, "id" | "content" | "createdAt">[];
  tags: string[];
  createdAt: string;
}

export interface Leader {
  id: string;
  user: User;
  title: string;
  constituency?: string;
  district?: string;
  followers: number;
  isFollowing: boolean;
  recentMessage?: string;
  recentMessageTime?: string;
  channelActive: boolean;
  priority: "national" | "state" | "district" | "constituency";
}

export interface LocalIssue {
  id: string;
  title: string;
  description: string;
  category: "road" | "water" | "electricity" | "sanitation" | "safety" | "education" | "health" | "other";
  images?: string[];
  reportedBy: Pick<User, "id" | "name" | "avatar">;
  location: UserLocation & { address: string };
  status: "open" | "acknowledged" | "in_progress" | "resolved";
  upvotes: number;
  upvoted: boolean;
  comments: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface Notification {
  id: string;
  type:
    | "like"
    | "comment"
    | "follow"
    | "event_reminder"
    | "leader_message"
    | "community_update"
    | "achievement"
    | "local_alert"
    | "campaign_update"
    | "mention";
  title: string;
  body: string;
  actor?: Pick<User, "id" | "name" | "avatar">;
  relatedId?: string;
  relatedType?: "post" | "event" | "community" | "leader" | "issue";
  isRead: boolean;
  createdAt: string;
}

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  category: "outreach" | "event_support" | "digital" | "field" | "logistics";
  pointsReward: number;
  location?: UserLocation;
  deadline?: string;
  assignedTo?: string;
  status: "available" | "in_progress" | "completed";
  difficulty: "easy" | "medium" | "hard";
  estimatedHours: number;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  PostDetail: { postId: string };
  EventDetail: { eventId: string };
  CommunityDetail: { communityId: string };
  LeaderChannel: { leaderId: string };
  UserProfile: { userId: string };
  IssueReport: undefined;
  IssueDetail: { issueId: string };
  Settings: undefined;
  LocationSelect: undefined;
  ReelViewer: { reelId: string };
  SearchResults: { query: string };
  AllStories: { startIndex: number };
  Notifications: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Reels: undefined;
  Discover: undefined;
  Community: undefined;
  Profile: undefined;
};

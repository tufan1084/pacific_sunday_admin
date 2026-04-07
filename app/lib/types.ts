// Users
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  country: string;
  status: "Active" | "Inactive" | "Banned";
  points: number;
  bags: number;
  joinedAt: string;
}

// Bags
export interface AdminBag {
  id: number;
  serial: string;
  model: string;
  owner: string;
  status: "Active" | "Inactive" | "Lost";
  nfcToken: string;
  scans: number;
  lastScan: string;
  registeredAt: string;
}

export interface TransferRequest {
  id: number;
  bag: string;
  from: string;
  to: string;
  status: "Pending" | "Approved" | "Rejected";
  requestedAt: string;
}

// Fantasy
export interface AdminGolfer {
  id: number;
  name: string;
  country: string;
  tier: "T1" | "T2" | "T3" | "T4" | "T5";
  ranking: number;
  avgScore: number;
  status: "Active" | "Inactive";
}

export interface FantasyRound {
  id: number;
  week: number;
  name: string;
  lockDeadline: string;
  totalPicks: number;
  status: "Upcoming" | "Live" | "Completed" | "Locked";
}

// Tournaments
export interface Tournament {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  rounds: number;
  golfers: number;
  status: "Upcoming" | "Live" | "Completed";
  pointsMultiplier: number;
}

// Leaderboard
export interface LeaderboardUser {
  rank: number;
  name: string;
  country: string;
  bag: string;
  points: number;
  weeksPlayed: number;
  streak: number;
}

// H2H
export interface H2HMatch {
  id: number;
  player1: string;
  player2: string;
  p1Score: number;
  p2Score: number;
  wager: number;
  status: "Active" | "Completed" | "Cancelled";
  result: "Won" | "Lost" | "Draw" | "Pending";
  createdAt: string;
}

// Achievements
export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlockedBy: number;
  totalUsers: number;
  status: "Active" | "Locked";
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  week: number;
  participants: number;
  completions: number;
  status: "Active" | "Upcoming" | "Completed";
}

// Community
export interface CommunityPost {
  id: number;
  author: string;
  content: string;
  group: string;
  likes: number;
  replies: number;
  reports: number;
  status: "Published" | "Flagged" | "Hidden";
  createdAt: string;
}

// Announcements
export interface Announcement {
  id: number;
  title: string;
  message: string;
  type: "Banner" | "Push" | "Both";
  audience: "All" | "Active" | "Premium";
  status: "Published" | "Draft" | "Scheduled";
  scheduledAt: string;
  sentTo: number;
}

// Rewards
export interface RewardItem {
  id: number;
  name: string;
  description: string;
  pointCost: number;
  stock: number;
  redeemed: number;
  category: string;
  status: "Active" | "Inactive";
}

export interface Redemption {
  id: number;
  user: string;
  item: string;
  points: number;
  status: "Pending" | "Fulfilled" | "Shipped";
  redeemedAt: string;
}

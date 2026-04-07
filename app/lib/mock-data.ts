import type {
  AdminUser, AdminBag, TransferRequest, AdminGolfer, FantasyRound,
  Tournament, LeaderboardUser, H2HMatch, Achievement, Challenge,
  CommunityPost, Announcement, RewardItem, Redemption,
} from "./types";

// ── Users ──
export const USERS: AdminUser[] = [
  { id: 1, name: "Ryan Mitchell", email: "ryan@example.com", country: "CA", status: "Active", points: 2450, bags: 2, joinedAt: "2025-11-15" },
  { id: 2, name: "Sophie Chen", email: "sophie@example.com", country: "US", status: "Active", points: 1890, bags: 1, joinedAt: "2025-12-01" },
  { id: 3, name: "Marcus Johnson", email: "marcus@example.com", country: "GB", status: "Active", points: 3100, bags: 1, joinedAt: "2025-10-20" },
  { id: 4, name: "Emily Walker", email: "emily@example.com", country: "AU", status: "Inactive", points: 750, bags: 1, joinedAt: "2026-01-05" },
  { id: 5, name: "David Park", email: "david@example.com", country: "KR", status: "Active", points: 2100, bags: 1, joinedAt: "2025-11-28" },
  { id: 6, name: "Isabella Rossi", email: "isabella@example.com", country: "IT", status: "Active", points: 1650, bags: 2, joinedAt: "2026-01-15" },
  { id: 7, name: "James O'Brien", email: "james@example.com", country: "IE", status: "Banned", points: 0, bags: 0, joinedAt: "2025-12-10" },
  { id: 8, name: "Aiko Tanaka", email: "aiko@example.com", country: "JP", status: "Active", points: 2800, bags: 1, joinedAt: "2025-10-05" },
  { id: 9, name: "Carlos Mendes", email: "carlos@example.com", country: "BR", status: "Active", points: 980, bags: 1, joinedAt: "2026-02-01" },
  { id: 10, name: "Fatima Al-Hassan", email: "fatima@example.com", country: "AE", status: "Active", points: 1420, bags: 1, joinedAt: "2026-01-20" },
  { id: 11, name: "Liam Cooper", email: "liam@example.com", country: "NZ", status: "Active", points: 3400, bags: 2, joinedAt: "2025-09-15" },
  { id: 12, name: "Nina Petrov", email: "nina@example.com", country: "RU", status: "Inactive", points: 420, bags: 1, joinedAt: "2026-02-14" },
];

// ── Bags ──
export const BAGS: AdminBag[] = [
  { id: 1, serial: "TC-2025-001", model: "Team Canada", owner: "Ryan Mitchell", status: "Active", nfcToken: "NFC-A1B2C3", scans: 42, lastScan: "2026-04-05", registeredAt: "2025-11-15" },
  { id: 2, serial: "TC-2025-006", model: "Team Canada", owner: "Ryan Mitchell", status: "Active", nfcToken: "NFC-D4E5F6", scans: 18, lastScan: "2026-04-03", registeredAt: "2025-12-20" },
  { id: 3, serial: "TU-2025-012", model: "Team USA", owner: "Sophie Chen", status: "Active", nfcToken: "NFC-G7H8I9", scans: 35, lastScan: "2026-04-06", registeredAt: "2025-12-01" },
  { id: 4, serial: "TG-2025-003", model: "Team GB", owner: "Marcus Johnson", status: "Active", nfcToken: "NFC-J0K1L2", scans: 56, lastScan: "2026-04-07", registeredAt: "2025-10-20" },
  { id: 5, serial: "TA-2026-001", model: "Team Australia", owner: "Emily Walker", status: "Inactive", nfcToken: "NFC-M3N4O5", scans: 8, lastScan: "2026-03-10", registeredAt: "2026-01-05" },
  { id: 6, serial: "TK-2025-007", model: "Team Korea", owner: "David Park", status: "Active", nfcToken: "NFC-P6Q7R8", scans: 29, lastScan: "2026-04-04", registeredAt: "2025-11-28" },
  { id: 7, serial: "TI-2026-002", model: "Team Italy", owner: "Isabella Rossi", status: "Active", nfcToken: "NFC-S9T0U1", scans: 15, lastScan: "2026-04-02", registeredAt: "2026-01-15" },
  { id: 8, serial: "TJ-2025-004", model: "Team Japan", owner: "Aiko Tanaka", status: "Active", nfcToken: "NFC-V2W3X4", scans: 47, lastScan: "2026-04-06", registeredAt: "2025-10-05" },
];

export const TRANSFER_REQUESTS: TransferRequest[] = [
  { id: 1, bag: "TC-2025-006", from: "Ryan Mitchell", to: "Sophie Chen", status: "Pending", requestedAt: "2026-04-05" },
  { id: 2, bag: "TI-2026-002", from: "Isabella Rossi", to: "Carlos Mendes", status: "Pending", requestedAt: "2026-04-03" },
  { id: 3, bag: "TG-2025-003", from: "James O'Brien", to: "Marcus Johnson", status: "Approved", requestedAt: "2026-03-20" },
];

// ── Fantasy Golfers ──
export const GOLFERS: AdminGolfer[] = [
  { id: 1, name: "Scottie Scheffler", country: "US", tier: "T1", ranking: 1, avgScore: -8.2, status: "Active" },
  { id: 2, name: "Rory McIlroy", country: "NIR", tier: "T1", ranking: 2, avgScore: -7.5, status: "Active" },
  { id: 3, name: "Jon Rahm", country: "ESP", tier: "T1", ranking: 3, avgScore: -7.1, status: "Active" },
  { id: 4, name: "Viktor Hovland", country: "NOR", tier: "T2", ranking: 6, avgScore: -5.8, status: "Active" },
  { id: 5, name: "Collin Morikawa", country: "US", tier: "T2", ranking: 8, avgScore: -5.2, status: "Active" },
  { id: 6, name: "Tommy Fleetwood", country: "ENG", tier: "T3", ranking: 14, avgScore: -4.1, status: "Active" },
  { id: 7, name: "Hideki Matsuyama", country: "JPN", tier: "T3", ranking: 16, avgScore: -3.8, status: "Active" },
  { id: 8, name: "Min Woo Lee", country: "AUS", tier: "T4", ranking: 25, avgScore: -2.5, status: "Active" },
  { id: 9, name: "Corey Conners", country: "CAN", tier: "T4", ranking: 28, avgScore: -2.2, status: "Active" },
  { id: 10, name: "Taylor Pendrith", country: "CAN", tier: "T5", ranking: 45, avgScore: -1.1, status: "Active" },
  { id: 11, name: "Nick Taylor", country: "CAN", tier: "T5", ranking: 52, avgScore: -0.8, status: "Inactive" },
];

export const FANTASY_ROUNDS: FantasyRound[] = [
  { id: 1, week: 1, name: "Opening Round", lockDeadline: "2026-04-10 08:00", totalPicks: 156, status: "Completed" },
  { id: 2, week: 2, name: "Week 2 - Links Classic", lockDeadline: "2026-04-17 08:00", totalPicks: 148, status: "Completed" },
  { id: 3, week: 3, name: "Week 3 - Pacific Open", lockDeadline: "2026-04-24 08:00", totalPicks: 89, status: "Live" },
  { id: 4, week: 4, name: "Week 4 - Major Week", lockDeadline: "2026-05-01 08:00", totalPicks: 0, status: "Upcoming" },
];

// ── Tournaments ──
export const TOURNAMENTS: Tournament[] = [
  { id: 1, name: "Pacific Sunday Open", location: "Royal Colwood, BC", startDate: "2026-04-09", endDate: "2026-04-12", rounds: 4, golfers: 72, status: "Live", pointsMultiplier: 1 },
  { id: 2, name: "Pacific Sunday Major", location: "Banff Springs, AB", startDate: "2026-05-01", endDate: "2026-05-04", rounds: 4, golfers: 64, status: "Upcoming", pointsMultiplier: 2 },
  { id: 3, name: "Pacific Sunday Invitational", location: "Cabot Cliffs, NS", startDate: "2026-03-20", endDate: "2026-03-23", rounds: 4, golfers: 48, status: "Completed", pointsMultiplier: 1 },
  { id: 4, name: "Pacific Sunday Championship", location: "St George's, ON", startDate: "2026-06-05", endDate: "2026-06-08", rounds: 4, golfers: 72, status: "Upcoming", pointsMultiplier: 1.5 },
];

// ── Leaderboard ──
export const LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Liam Cooper", country: "NZ", bag: "TNZ-2025-001", points: 3400, weeksPlayed: 12, streak: 8 },
  { rank: 2, name: "Marcus Johnson", country: "GB", bag: "TG-2025-003", points: 3100, weeksPlayed: 14, streak: 5 },
  { rank: 3, name: "Aiko Tanaka", country: "JP", bag: "TJ-2025-004", points: 2800, weeksPlayed: 13, streak: 3 },
  { rank: 4, name: "Ryan Mitchell", country: "CA", bag: "TC-2025-001", points: 2450, weeksPlayed: 11, streak: 4 },
  { rank: 5, name: "David Park", country: "KR", bag: "TK-2025-007", points: 2100, weeksPlayed: 10, streak: 2 },
  { rank: 6, name: "Sophie Chen", country: "US", bag: "TU-2025-012", points: 1890, weeksPlayed: 9, streak: 6 },
  { rank: 7, name: "Isabella Rossi", country: "IT", bag: "TI-2026-002", points: 1650, weeksPlayed: 7, streak: 1 },
  { rank: 8, name: "Fatima Al-Hassan", country: "AE", bag: "TAE-2026-001", points: 1420, weeksPlayed: 6, streak: 3 },
  { rank: 9, name: "Carlos Mendes", country: "BR", bag: "TB-2026-003", points: 980, weeksPlayed: 4, streak: 2 },
  { rank: 10, name: "Emily Walker", country: "AU", bag: "TA-2026-001", points: 750, weeksPlayed: 3, streak: 0 },
];

// ── H2H ──
export const H2H_MATCHES: H2HMatch[] = [
  { id: 1, player1: "Ryan Mitchell", player2: "Sophie Chen", p1Score: 145, p2Score: 138, wager: 50, status: "Active", result: "Pending", createdAt: "2026-04-05" },
  { id: 2, player1: "Marcus Johnson", player2: "Aiko Tanaka", p1Score: 210, p2Score: 195, wager: 100, status: "Completed", result: "Won", createdAt: "2026-03-28" },
  { id: 3, player1: "David Park", player2: "Liam Cooper", p1Score: 180, p2Score: 180, wager: 75, status: "Completed", result: "Draw", createdAt: "2026-03-21" },
  { id: 4, player1: "Isabella Rossi", player2: "Carlos Mendes", p1Score: 0, p2Score: 0, wager: 50, status: "Active", result: "Pending", createdAt: "2026-04-06" },
  { id: 5, player1: "Fatima Al-Hassan", player2: "Emily Walker", p1Score: 120, p2Score: 155, wager: 25, status: "Completed", result: "Lost", createdAt: "2026-03-15" },
  { id: 6, player1: "Liam Cooper", player2: "Ryan Mitchell", p1Score: 0, p2Score: 0, wager: 150, status: "Cancelled", result: "Pending", createdAt: "2026-04-01" },
];

// ── Achievements ──
export const ACHIEVEMENTS: Achievement[] = [
  { id: 1, name: "First Pick", description: "Make your first fantasy pick", icon: "star", points: 50, unlockedBy: 145, totalUsers: 156, status: "Active" },
  { id: 2, name: "Winning Streak", description: "Win 3 H2H matches in a row", icon: "trophy", points: 200, unlockedBy: 23, totalUsers: 156, status: "Active" },
  { id: 3, name: "Community Voice", description: "Post 10 messages in community", icon: "message", points: 100, unlockedBy: 67, totalUsers: 156, status: "Active" },
  { id: 4, name: "NFC Pioneer", description: "Scan your bag 50 times", icon: "nfc", points: 300, unlockedBy: 12, totalUsers: 156, status: "Active" },
  { id: 5, name: "Perfect Week", description: "Score max points in a single week", icon: "crown", points: 500, unlockedBy: 3, totalUsers: 156, status: "Active" },
  { id: 6, name: "Globe Trotter", description: "Play from 5 different countries", icon: "globe", points: 150, unlockedBy: 0, totalUsers: 156, status: "Locked" },
];

export const CHALLENGES: Challenge[] = [
  { id: 1, title: "Pick All Tiers", description: "Select at least one golfer from each tier", points: 75, week: 3, participants: 89, completions: 42, status: "Active" },
  { id: 2, title: "Community Champion", description: "Get 10 likes on a single post", points: 50, week: 3, participants: 34, completions: 8, status: "Active" },
  { id: 3, title: "H2H Warrior", description: "Complete 3 H2H challenges this week", points: 100, week: 3, participants: 28, completions: 5, status: "Active" },
  { id: 4, title: "Scan Streak", description: "Scan your NFC bag 5 days in a row", points: 60, week: 4, participants: 0, completions: 0, status: "Upcoming" },
];

// ── Community ──
export const COMMUNITY_POSTS: CommunityPost[] = [
  { id: 1, author: "Ryan Mitchell", content: "Scheffler is on fire this week! My T1 pick is paying off big time.", group: "All Owners", likes: 24, replies: 8, reports: 0, status: "Published", createdAt: "2026-04-06 14:30" },
  { id: 2, author: "Marcus Johnson", content: "Anyone else struggling with T3 picks? The field is so tight.", group: "Team GB", likes: 12, replies: 15, reports: 0, status: "Published", createdAt: "2026-04-06 11:20" },
  { id: 3, author: "James O'Brien", content: "This platform is rigged, the scoring makes no sense!!!", group: "All Owners", likes: 2, replies: 22, reports: 5, status: "Flagged", createdAt: "2026-04-05 18:45" },
  { id: 4, author: "Sophie Chen", content: "Love the new H2H feature! Just challenged David to a match.", group: "Team USA", likes: 18, replies: 4, reports: 0, status: "Published", createdAt: "2026-04-05 09:15" },
  { id: 5, author: "Aiko Tanaka", content: "Guide: How to maximize your points with tier strategy.", group: "All Owners", likes: 56, replies: 31, reports: 0, status: "Published", createdAt: "2026-04-04 16:00" },
  { id: 6, author: "Anonymous", content: "Spam content with links to external site", group: "All Owners", likes: 0, replies: 0, reports: 8, status: "Hidden", createdAt: "2026-04-04 02:30" },
];

// ── Announcements ──
export const ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: "Pacific Sunday Major — Double Points!", message: "The upcoming Major at Banff Springs will award double fantasy points.", type: "Both", audience: "All", status: "Published", scheduledAt: "2026-04-01 10:00", sentTo: 156 },
  { id: 2, title: "Maintenance Window", message: "Scheduled maintenance on April 15 from 2-4 AM EST.", type: "Push", audience: "All", status: "Scheduled", scheduledAt: "2026-04-13 08:00", sentTo: 0 },
  { id: 3, title: "New H2H Feature", message: "Challenge your friends in head-to-head matches!", type: "Banner", audience: "Active", status: "Published", scheduledAt: "2026-03-25 09:00", sentTo: 132 },
  { id: 4, title: "Welcome Back Bonus", message: "Inactive users get 100 bonus points for returning.", type: "Push", audience: "All", status: "Draft", scheduledAt: "", sentTo: 0 },
];

// ── Rewards ──
export const REWARD_ITEMS: RewardItem[] = [
  { id: 1, name: "Pacific Sunday Cap", description: "Embroidered logo cap", pointCost: 500, stock: 48, redeemed: 32, category: "Apparel", status: "Active" },
  { id: 2, name: "Pacific Sunday Polo", description: "Premium performance polo", pointCost: 1200, stock: 20, redeemed: 15, category: "Apparel", status: "Active" },
  { id: 3, name: "Golf Towel", description: "Microfiber tour towel", pointCost: 300, stock: 100, redeemed: 45, category: "Accessories", status: "Active" },
  { id: 4, name: "Ball Marker Set", description: "Set of 3 custom ball markers", pointCost: 200, stock: 75, redeemed: 60, category: "Accessories", status: "Active" },
  { id: 5, name: "VIP Event Pass", description: "Access to exclusive Pacific Sunday event", pointCost: 5000, stock: 5, redeemed: 2, category: "Experiences", status: "Active" },
  { id: 6, name: "Signed Glove", description: "Glove signed by a tour player", pointCost: 3000, stock: 0, redeemed: 10, category: "Collectibles", status: "Inactive" },
];

export const REDEMPTIONS: Redemption[] = [
  { id: 1, user: "Liam Cooper", item: "VIP Event Pass", points: 5000, status: "Fulfilled", redeemedAt: "2026-04-02" },
  { id: 2, user: "Marcus Johnson", item: "Pacific Sunday Polo", points: 1200, status: "Shipped", redeemedAt: "2026-04-04" },
  { id: 3, user: "Ryan Mitchell", item: "Pacific Sunday Cap", points: 500, status: "Pending", redeemedAt: "2026-04-06" },
  { id: 4, user: "Aiko Tanaka", item: "Ball Marker Set", points: 200, status: "Fulfilled", redeemedAt: "2026-04-01" },
  { id: 5, user: "Sophie Chen", item: "Golf Towel", points: 300, status: "Pending", redeemedAt: "2026-04-07" },
];

// ── Dashboard Stats ──
export const DASHBOARD_STATS = {
  totalUsers: 156,
  activeUsers: 132,
  totalBags: 143,
  totalScans: 4280,
  fantasyParticipation: 89,
  communityPosts: 342,
  rewardsRedeemed: 164,
  revenue: "$12,450",
  userGrowth: "12.5%",
  scanGrowth: "8.3%",
  postGrowth: "15.2%",
  rewardGrowth: "22.1%",
};

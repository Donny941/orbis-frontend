import api from "./api";

export interface LeaderboardUser {
  id: string;
  userName: string;
  displayName: string;
  profilePicture: string | null;
  totalOrbPoints: number;
  level: number;
  levelName: string;
  currentStreak: number;
}

export const leaderboardService = {
  getLeaderboard: async (top: number = 10): Promise<LeaderboardUser[]> => {
    const response = await api.get("/points/leaderboard", {
      params: { top },
    });
    return response.data;
  },
};

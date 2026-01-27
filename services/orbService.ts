import api from "./api";
import type { Orb } from "../types";

export const orbService = {
  // Get all orbs
  getAllOrbs: async (): Promise<Orb[]> => {
    const response = await api.get("/orbs");
    return response.data;
  },

  // Get user's joined orbs
  getMyOrbs: async (): Promise<Orb[]> => {
    const response = await api.get("/orbs/my-orbs");
    return response.data;
  },

  // Get orb details
  getOrbById: async (id: string): Promise<Orb> => {
    const response = await api.get(`/orbs/${id}`);
    return response.data;
  },

  // Join orb
  joinOrb: async (orbId: string): Promise<void> => {
    await api.post(`/orbs/${orbId}/join`);
  },

  // Leave orb
  leaveOrb: async (orbId: string): Promise<void> => {
    await api.delete(`/orbs/${orbId}/leave`);
  },

  // Check if user is member
  isOrbMember: async (orbId: string): Promise<boolean> => {
    const response = await api.get(`/orbs/${orbId}/is-member`);
    return response.data.isMember;
  },

  // Get orb members
  getOrbMembers: async (orbId: string, page: number = 1, size: number = 20) => {
    const response = await api.get(`/orbs/${orbId}/members`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get orb resources
  getOrbResources: async (orbId: string, page: number = 1, size: number = 10, sort: "recent" | "popular" | "views" = "recent") => {
    const response = await api.get(`/orbs/${orbId}/resources`, {
      params: { page, size, sort },
    });
    return response.data;
  },
};

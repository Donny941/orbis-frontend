import api from "./api";
import type { Resource, PaginatedResponse } from "../types";

export const resourceService = {
  // Get resources with filters
  getResources: async (params: {
    orbId?: string;
    type?: string;
    difficulty?: string;
    sort?: "recent" | "popular" | "views";
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Resource>> => {
    const response = await api.get("/resources", {
      params: {
        page: params.page || 1,
        size: params.size || 10,
        ...params,
      },
    });
    return {
      data: response.data.data,
      page: response.data.pagination.currentPage,
      pageSize: response.data.pagination.pageSize,
      totalCount: response.data.pagination.totalCount,
      totalPages: response.data.pagination.totalPages,
    };
  },

  // Get recent resources from user's orbs (feed)
  getRecentFromMyOrbs: async (limit: number = 10): Promise<Resource[]> => {
    // Il backend non ha endpoint dedicato, quindi usiamo /resources senza filtri
    // Le risorse saranno dalle orbs pubbliche
    const response = await api.get("/resources", {
      params: {
        page: 1,
        size: limit,
        sort: "recent",
      },
    });
    return response.data.data;
  },

  // Get my drafts
  getMyDrafts: async (page: number = 1, size: number = 10): Promise<PaginatedResponse<Resource>> => {
    const response = await api.get("/resources/my-drafts", {
      params: { page, size },
    });
    return {
      data: response.data.data,
      page: response.data.pagination.currentPage,
      pageSize: response.data.pagination.pageSize,
      totalCount: response.data.pagination.totalCount,
      totalPages: response.data.pagination.totalPages,
    };
  },

  // Get resource by ID
  getResourceById: async (id: string): Promise<Resource> => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  // Create resource
  createResource: async (data: {
    title: string;
    content: string;
    orbId: string;
    type: string;
    difficulty?: string;
    tags: string[];
    status?: "Draft" | "Published";
  }): Promise<Resource> => {
    const response = await api.post("/resources", data);
    return response.data;
  },

  // Update resource
  updateResource: async (
    id: string,
    data: {
      title?: string;
      content?: string;
      type?: string;
      difficulty?: string;
      tags?: string[];
    },
  ): Promise<Resource> => {
    const response = await api.put(`/resources/${id}`, data);
    return response.data;
  },

  // Delete resource
  deleteResource: async (id: string): Promise<void> => {
    await api.delete(`/resources/${id}`);
  },

  // Publish draft
  publishResource: async (id: string): Promise<Resource> => {
    const response = await api.post(`/resources/${id}/publish`);
    return response.data;
  },

  // Give Orb
  giveOrb: async (id: string): Promise<void> => {
    await api.post(`/resources/${id}/orb`);
  },

  // Remove Orb
  removeOrb: async (id: string): Promise<void> => {
    await api.delete(`/resources/${id}/orb`);
  },

  // Get resource orbs (users who gave orbs)
  getResourceOrbs: async (id: string) => {
    const response = await api.get(`/resources/${id}/orbs`);
    return response.data;
  },
};

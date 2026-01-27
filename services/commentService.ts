import api from "./api";
import type { Comment } from "../types";

export const commentService = {
  // Get comments for a resource
  getResourceComments: async (resourceId: string): Promise<Comment[]> => {
    const response = await api.get("/comments", {
      params: { resourceId },
    });
    return response.data;
  },

  // Create comment
  createComment: async (resourceId: string, content: string): Promise<Comment> => {
    const response = await api.post("/comments", {
      resourceId,
      content,
    });
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },

  // Give Orb to comment
  giveOrbToComment: async (commentId: string): Promise<void> => {
    await api.post(`/comments/${commentId}/orb`);
  },

  // Remove Orb from comment
  removeOrbFromComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}/orb`);
  },
};

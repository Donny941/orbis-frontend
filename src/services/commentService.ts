// src/services/commentService.ts
import api from "./api";
import type { Comment } from "../../types";

export const commentService = {
  // Get all comments for a resource
  getComments: async (resourceId: string): Promise<Comment[]> => {
    const response = await api.get<Comment[]>("/comments", {
      params: { resourceId },
    });
    return response.data;
  },

  // Create a new comment
  createComment: async (resourceId: string, content: string): Promise<Comment> => {
    const response = await api.post<Comment>(
      "/comments",
      { content },
      {
        params: { resourceId },
      },
    );
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },

  // Give orb to a comment
  giveOrb: async (commentId: string): Promise<void> => {
    await api.post(`/comments/${commentId}/orb`);
  },

  // Remove orb from a comment
  removeOrb: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}/orb`);
  },
};

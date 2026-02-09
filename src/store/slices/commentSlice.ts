import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commentService } from "../../../services/commentService";
import type { Comment, User } from "../../../types";

interface CommentsState {
  comments: Comment[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// --- Thunks ---

export const fetchComments = createAsyncThunk("comments/fetchComments", async (resourceId: string, { rejectWithValue }) => {
  try {
    return await commentService.getComments(resourceId);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to fetch comments");
  }
});

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ resourceId, content }: { resourceId: string; content: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const currentUser = state.auth.user;
      const comment = await commentService.createComment(resourceId, content);

      if (currentUser && (!comment.author || !comment.author.displayName)) {
        comment.author = { ...currentUser };
      }

      return comment;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to create comment");
    }
  },
);

export const deleteComment = createAsyncThunk("comments/deleteComment", async (commentId: string, { rejectWithValue }) => {
  try {
    await commentService.deleteComment(commentId);
    return commentId;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to delete comment");
  }
});

export const toggleCommentOrb = createAsyncThunk(
  "comments/toggleOrb",
  async ({ commentId, hasOrbed }: { commentId: string; hasOrbed: boolean }, { rejectWithValue }) => {
    try {
      if (hasOrbed) {
        await commentService.removeOrb(commentId);
      } else {
        await commentService.giveOrb(commentId);
      }
      return { commentId, hasOrbed: !hasOrbed };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to toggle orb");
    }
  },
);

// --- Slice ---

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c.id !== action.payload);
      })

      // Toggle Orb
      .addCase(toggleCommentOrb.fulfilled, (state, action) => {
        const { commentId, hasOrbed } = action.payload;
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.hasUserOrbed = hasOrbed;
          comment.orbsReceived += hasOrbed ? 1 : -1;
        }
      });
  },
});

export const { clearComments, clearError } = commentsSlice.actions;
export default commentsSlice.reducer;

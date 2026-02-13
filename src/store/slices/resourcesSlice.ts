import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { resourceService } from "../../../services/resourceService";
import type { Resource } from "../../../types";

interface ResourcesState {
  resources: Resource[];
  myResources: Resource[];
  favourites: Resource[];
  isLoadingFavourites: boolean;
  currentResource: Resource | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isLoadingMine: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  filters: {
    orbId?: string;
    type?: string;
    difficulty?: string;
    sort?: "recent" | "popular" | "views";
  };
}

const initialState: ResourcesState = {
  resources: [],
  myResources: [],
  favourites: [],
  isLoadingFavourites: false,
  currentResource: null,
  isLoading: false,
  isLoadingMore: false,
  isLoadingMine: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },
  filters: {},
};

// --- Thunks ---

export const fetchResources = createAsyncThunk(
  "resources/fetchResources",
  async (
    params: {
      orbId?: string;
      type?: string;
      difficulty?: string;
      sort?: "recent" | "popular" | "views";
      page?: number;
      size?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      return await resourceService.getResources(params);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch resources");
    }
  },
);

export const fetchMoreResources = createAsyncThunk("resources/fetchMoreResources", async (_, { getState, rejectWithValue }) => {
  const state = getState() as { resources: ResourcesState };
  const { pagination, filters } = state.resources;

  try {
    return await resourceService.getResources({
      ...filters,
      page: pagination.page + 1,
      size: pagination.pageSize,
    });
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to fetch more resources");
  }
});

export const fetchMyResources = createAsyncThunk("resources/fetchMyResources", async (_, { rejectWithValue }) => {
  try {
    return await resourceService.getMyResources();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to fetch your resources");
  }
});

export const fetchResource = createAsyncThunk("resources/fetchResource", async (id: string, { rejectWithValue }) => {
  try {
    return await resourceService.getResourceById(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to fetch resource");
  }
});

export const createResource = createAsyncThunk(
  "resources/createResource",
  async (
    data: {
      title: string;
      content: string;
      orbId: string;
      type: string;
      difficulty?: string;
      tags: string[];
      status?: "Draft" | "Published";
    },
    { rejectWithValue },
  ) => {
    try {
      return await resourceService.createResource(data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to create resource");
    }
  },
);

export const updateResource = createAsyncThunk(
  "resources/updateResource",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: {
        title?: string;
        content?: string;
        type?: string;
        difficulty?: string;
        tags?: string[];
      };
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await resourceService.updateResource(id, data);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to update resource");
    }
  },
);

export const publishResource = createAsyncThunk("resources/publishResource", async (id: string, { rejectWithValue }) => {
  try {
    const response = await resourceService.publishResource(id);
    return { id, resource: response };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to publish resource");
  }
});

export const unpublishResource = createAsyncThunk("resources/unpublishResource", async (id: string, { rejectWithValue }) => {
  try {
    const response = await resourceService.unpublishResource(id);
    return { id, resource: response };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to unpublish resource");
  }
});

export const deleteResource = createAsyncThunk("resources/deleteResource", async (id: string, { rejectWithValue }) => {
  try {
    await resourceService.deleteResource(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to delete resource");
  }
});

export const toggleResourceOrb = createAsyncThunk(
  "resources/toggleOrb",
  async ({ resourceId, hasOrbed }: { resourceId: string; hasOrbed: boolean }, { rejectWithValue }) => {
    try {
      if (hasOrbed) {
        await resourceService.removeOrb(resourceId);
      } else {
        await resourceService.giveOrb(resourceId);
      }
      return { resourceId, hasOrbed: !hasOrbed };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to toggle orb");
    }
  },
);

export const fetchFavourites = createAsyncThunk("resources/fetchFavourites", async (params: { page?: number; size?: number } = {}, { rejectWithValue }) => {
  try {
    return await resourceService.getFavourites(params.page, params.size);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to fetch favourites");
  }
});

// --- Slice ---

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    clearCurrentResource: (state) => {
      state.currentResource = null;
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<ResourcesState["filters"]>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Resources (Initial)
      .addCase(fetchResources.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Favourites
      .addCase(fetchFavourites.pending, (state) => {
        state.isLoadingFavourites = true;
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.isLoadingFavourites = false;
        state.favourites = action.payload.data;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.isLoadingFavourites = false;
        state.error = action.payload as string;
      })

      // Fetch More Resources (Incremental)
      .addCase(fetchMoreResources.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(fetchMoreResources.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.resources = [...state.resources, ...action.payload.data];
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchMoreResources.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      // Fetch My Resources
      .addCase(fetchMyResources.pending, (state) => {
        state.isLoadingMine = true;
        state.error = null;
      })
      .addCase(fetchMyResources.fulfilled, (state, action) => {
        state.isLoadingMine = false;
        state.myResources = action.payload;
      })
      .addCase(fetchMyResources.rejected, (state, action) => {
        state.isLoadingMine = false;
        state.error = action.payload as string;
      })

      // Fetch Single Resource
      .addCase(fetchResource.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResource = action.payload;
      })
      .addCase(fetchResource.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Resource
      .addCase(createResource.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myResources.unshift(action.payload);
        if (action.payload.status === "Published") {
          state.resources.unshift(action.payload);
        }
      })
      .addCase(createResource.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Resource
      .addCase(updateResource.fulfilled, (state, action) => {
        const updated = action.payload;
        const updateItem = (r: Resource) => (r.id === updated.id ? updated : r);
        state.myResources = state.myResources.map(updateItem);
        state.resources = state.resources.map(updateItem);
        if (state.currentResource?.id === updated.id) {
          state.currentResource = updated;
        }
      })

      // Publish Resource
      .addCase(publishResource.fulfilled, (state, action) => {
        const { id } = action.payload;
        const updateStatus = (r: Resource) => {
          if (r.id === id) {
            r.status = "Published";
            r.publishedAt = new Date().toISOString();
          }
          return r;
        };
        state.myResources = state.myResources.map(updateStatus);
        state.resources = state.resources.map(updateStatus);
        if (state.currentResource?.id === id) {
          state.currentResource.status = "Published";
          state.currentResource.publishedAt = new Date().toISOString();
        }
      })

      // Unpublish Resource
      .addCase(unpublishResource.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.myResources = state.myResources.map((r) => {
          if (r.id === id) {
            r.status = "Draft";
            r.publishedAt = undefined;
          }
          return r;
        });
        state.resources = state.resources.filter((r) => r.id !== id);
        if (state.currentResource?.id === id) {
          state.currentResource.status = "Draft";
          state.currentResource.publishedAt = undefined;
        }
      })

      // Delete Resource
      .addCase(deleteResource.fulfilled, (state, action) => {
        const id = action.payload;
        state.myResources = state.myResources.filter((r) => r.id !== id);
        state.resources = state.resources.filter((r) => r.id !== id);
        if (state.currentResource?.id === id) {
          state.currentResource = null;
        }
      })

      // Toggle Orb
      .addCase(toggleResourceOrb.fulfilled, (state, action) => {
        const { resourceId, hasOrbed } = action.payload;
        const updateOrb = (resource: Resource) => {
          resource.hasUserOrbed = hasOrbed;
          resource.totalOrbsReceived += hasOrbed ? 1 : -1;
        };
        const res = state.resources.find((r) => r.id === resourceId);
        if (res) updateOrb(res);
        const myRes = state.myResources.find((r) => r.id === resourceId);
        if (myRes) updateOrb(myRes);
        if (state.currentResource?.id === resourceId) {
          updateOrb(state.currentResource);
        }
      });
  },
});

export const { clearCurrentResource, setFilters, clearFilters, clearError } = resourcesSlice.actions;
export default resourcesSlice.reducer;

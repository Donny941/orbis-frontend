import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orbService } from "../../services/orbService";
import type { Orb } from "../../../types";

interface OrbsState {
  allOrbs: Orb[];
  myOrbs: Orb[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrbsState = {
  allOrbs: [],
  myOrbs: [],
  isLoading: false,
  error: null,
};

// Thunks
export const fetchAllOrbs = createAsyncThunk("orbs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const [allOrbs, myOrbs] = await Promise.all([orbService.getAllOrbs(), orbService.getMyOrbs()]);

    const joinedIds = new Set(myOrbs.map((o) => o.id));
    const orbsWithStatus = allOrbs.map((orb) => ({
      ...orb,
      isJoined: joinedIds.has(orb.id),
    }));

    return { allOrbs: orbsWithStatus, myOrbs };
  } catch {
    return rejectWithValue("Failed to fetch orbs");
  }
});

export const fetchMyOrbs = createAsyncThunk("orbs/fetchMyOrbs", async (_, { rejectWithValue }) => {
  try {
    const myOrbs = await orbService.getMyOrbs();
    return myOrbs;
  } catch {
    return rejectWithValue("Failed to fetch my orbs");
  }
});

export const joinOrb = createAsyncThunk("orbs/join", async (orbId: string, { rejectWithValue }) => {
  try {
    await orbService.joinOrb(orbId);
    return orbId;
  } catch {
    return rejectWithValue("Failed to join orb");
  }
});

export const leaveOrb = createAsyncThunk("orbs/leave", async (orbId: string, { rejectWithValue }) => {
  try {
    await orbService.leaveOrb(orbId);
    return orbId;
  } catch {
    return rejectWithValue("Failed to leave orb");
  }
});

const orbsSlice = createSlice({
  name: "orbs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchAllOrbs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrbs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allOrbs = action.payload.allOrbs;
        state.myOrbs = action.payload.myOrbs;
      })
      .addCase(fetchAllOrbs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch My Orbs
    builder.addCase(fetchMyOrbs.fulfilled, (state, action) => {
      state.myOrbs = action.payload;
    });

    // Join
    builder.addCase(joinOrb.fulfilled, (state, action) => {
      const orbId = action.payload;

      const orb = state.allOrbs.find((o) => o.id === orbId);
      if (orb) {
        orb.isJoined = true;
        orb.memberCount += 1;

        state.myOrbs.push({ ...orb });
      }
    });

    // Leave
    builder.addCase(leaveOrb.fulfilled, (state, action) => {
      const orbId = action.payload;

      const orb = state.allOrbs.find((o) => o.id === orbId);
      if (orb) {
        orb.isJoined = false;
        orb.memberCount -= 1;
      }

      state.myOrbs = state.myOrbs.filter((o) => o.id !== orbId);
    });
  },
});

export default orbsSlice.reducer;

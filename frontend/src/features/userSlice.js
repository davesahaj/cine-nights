import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "../common/socket";

const initialState = { name: null, room: null };
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.room = action.payload.room;
      socket.emit("user:joinroom", { name: state.name, room: state.room });
    },
    resetUser: (state) => {
      state = initialState;
    },
  },

  // extraReducers: (builder) => {
  //   builder.addCase().addCase();
  // },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;

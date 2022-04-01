import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../common/socket";

const initialState = [];

const messageSlice = createSlice({
  name: "messages",
  initialState,

  reducers: {
    sendMessage: (state, action) => {
      const data = {
        type: "message",
        time: Date.now(),
        user: action.payload.user,
        message: action.payload.message,
        received: false,
      };
      state.push(data);

      socket.emit("message:toServer", { data: action.payload });
    },
    receiveMessage: (state, action) => {
      const data = {
        type: action.payload.type,
        time: action.payload.time,
        user: action.payload.user,
        message: action.payload.message,
        received: action.payload.received,
      };
      state.push(data);
    },

    receiveNotification: (state, action) => {
      const data = {
        type: action.payload.type,
        message: action.payload.message,
      };
      state.push(data);
    },
  },
});

export const { sendMessage, receiveMessage, receiveNotification } =
  messageSlice.actions;
export default messageSlice.reducer;

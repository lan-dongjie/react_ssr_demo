import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    user_update: (state, { payload }) => {
      Object.assign(state, payload);
    },
    user_logout: (state) => {
      state = {};
      console.log("user_logout", state);
    },
  },
});

export const { user_update, user_logout } = user.actions;
export default user.reducer;

import { createSlice } from "@reduxjs/toolkit";
// const user = createSlice({
//   name: "user",
//   initialState: {
//     name: "test @reduxjs/toolkit",
//   },
//   reducers: {
//     updateName: (state, { name }) => {
//       state.name = name;
//     },
//   },
// });

function initialUserReducer(state) {
  return user.reducer;
}

const user = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    update_user: (state, { userInfo }) => {
      state = userInfo;
    },
    logout: (state) => {
      state = null;
    },
  },
});

export const { update_user, logout } = user.actions;
export default user.reducer;
// export default user.reducer;

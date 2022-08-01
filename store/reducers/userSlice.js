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
  const user = createSlice({
    name: "user",
    initialState: state || { name: "" },
    reducers: {
      updateName: (state, { name }) => {
        state.name = name;
      },
    },
  });
  return user.reducer;
}
export default initialUserReducer;
// export default user.reducer;

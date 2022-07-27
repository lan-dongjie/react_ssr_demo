import { createSlice } from "@reduxjs/toolkit";
const user = createSlice({
  name: "user",
  initialState: {
    name: "test @reduxjs/toolkit",
  },
  reducers: {
    updateName: (state, { name }) => {
      state.name = name;
    },
  },
});
export default user.reducer;

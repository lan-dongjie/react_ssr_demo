function useReducer(state) {
  const slice = createSlice({
    name: state.name,
    initialState: state.initialState,
    reducers: {
      updateName: (state, { name }) => {
        state.name = name;
      },
    },
  });
  return slice.reducer;
}

export default useReducer;

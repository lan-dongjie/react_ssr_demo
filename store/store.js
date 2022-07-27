import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";
import counterSlice from "./reducers/counterSilce";
// import {createStore} from "redux";
// import ReduxThunk from "redux-thunk";

// const initialUser = {
//   name: "de ma xi ya",
// };
// const UPDATE_USER_NAME = "UPDATE_USER_NAME";
// function userReducer(state = initialCounter, action) {
//   switch (action.type) {
//     case UPDATE_USER_NAME:
//       return { ...state, name: action.name };

//     default:
//       return state;
//   }
// }
// const initialCounter = {
//   count: 0,
// };

// const ADD = "ADD";
// function counterReducer(state = initialCounter, action) {
//   switch (action.type) {
//     case ADD:
//       return { ...state, count: state.count + (action.num || 1) };

//     default:
//       return state;
//   }
// }

// const initialState = {
//   user: initialUser,
//   counter: initialCounter,
// };

// const allRenducers = {
//   userReducer,
//   counterReducer
// }

// const store = createStore(allRenducers,initialState,composeWithDevTools(apllyMiddleware(ReduxThunk)));
// store.subscribe(() => console.log(store.getState()))
// export default store
export default function createStore(state) {
  const store = configureStore({
    reducer: {
      ...state,
      counter: counterSlice,
      user: userSlice,
    },
  });
  return store;
}

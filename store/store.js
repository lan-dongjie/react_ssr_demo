import axios from "axios";
import { configureStore } from "@reduxjs/toolkit";
// import { useSelector, useDispatch } from "react-redux";
import userReducer, { user_update, user_logout } from "./reducers/useReducer";
import { router } from "next/router";

export * from "./reducers/useReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
export function initState(state = { user: {} }) {
  for (const name in state) {
    if (Object.hasOwnProperty.call(state, name)) {
      const initState = state[name];
      if (name === "user") {
        store.dispatch(user_update(initState));
      } else {
        console.log("new state", name);
      }
    }
  }
}

export function logout() {
  return (dispatch) =>
    axios
      .post("/logout")
      .then((resp) => {
        if (resp.status === 200) {
          dispatch(user_logout());
          router.push("/");
        } else {
          console.log("resp", resp);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
}

export default store;

import axios from "axios";
import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./reducers/useReducer";
import initialUserReducer from "./reducers/userSlice";
// import counterSlice from "./reducers/counterSilce";
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

// const allRenducers = combineReducers({
//   user: userReducer,
//   counter: counterReducer
// })

// const store = createStore(allRenducers,initialState,composeWithDevTools(apllyMiddleware(ReduxThunk)));
// store.subscribe(() => console.log(store.getState()))
// export default store
// function initializeStore(state) {
//   return createStore(allRenducers,Object.assign({},initialState,state),composeWithDevTools(apllyMiddleware(ReduxThunk)));
// }
// export default initializeStore

function initialReducer(state = { user: {} }) {
  const reducer = {};
  for (const name in state) {
    if (Object.hasOwnProperty.call(state, name)) {
      const initSate = state[name];
      if (name === "user") {
        reducer[name] = initialUserReducer(initSate);
      } else {
        reducer[name] = useReducer({
          name,
          initialState: initSate,
        });
      }
    }
  }
  return reducer;
}
export const LOGOUT = "LOGOUT";
export function logout() {
  return (dispatch) => {
    axios
      .post(".logout")
      .then((resp) => {
        if (resp.status === 200) {
          dispatch({ type: LOGOUT });
        } else {
          console.log("resp", resp);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export default function initializeStore(state) {
  const store = configureStore({
    reducer: initialReducer(state),
  });
  return store;
}

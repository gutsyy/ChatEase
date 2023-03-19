import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/app";
import promptReducer from "./reducers/promptSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    prompt: promptReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

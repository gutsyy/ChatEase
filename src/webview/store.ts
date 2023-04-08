import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatSlice";
import appReducer from "./reducers/appSlice";
import promptReducer from "./reducers/promptSlice";
import settingsReducer from "./reducers/settingSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    chat: chatReducer,
    prompt: promptReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {},
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// export type AppActions = ReturnType<typeof appSlice.actions>;
// export type ChatActions = ReturnType<typeof chatSlice.actions>;
// export type PromptActions = ReturnType<typeof promptSlice.actions>;

export default store;

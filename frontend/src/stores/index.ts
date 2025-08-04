import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import itemsReducer from "../features/items/itemSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    items: itemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

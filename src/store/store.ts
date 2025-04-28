
import { configureStore } from '@reduxjs/toolkit';
import selectedConversationReducer from "./selectedConversationSlice"

export const store = configureStore({
  reducer: {
    selectedConversation: selectedConversationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
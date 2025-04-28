// store/counterSlice.ts
import { createSlice,PayloadAction} from '@reduxjs/toolkit';

interface selectedConversationSlice {
  username: string;
}

const initialState: selectedConversationSlice = {
  username:"",
};

export const selectedConversationSlice = createSlice({
  name: 'selectedConversation',
  initialState,
  reducers: {
    setUsername: (state,action:PayloadAction<string>) => {
      state.username = action.payload;
    },
    removeId: (state) => {
      state.username = "";
    },
  },
});

export const { setUsername, removeId } = selectedConversationSlice.actions;
export default selectedConversationSlice.reducer;

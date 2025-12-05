import { createSlice, nanoid } from '@reduxjs/toolkit';

const artSlice = createSlice({
  name: 'art',
  initialState: {
    searchTerm: '',
    data: [],
  },
  reducers: {
    changeSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    addArt(state, action) {
      state.data.push({
        name: action.payload.name,
        price: action.payload.price,
        id: nanoid(),
      });
    },
    removeArt(state, action) {
      const updated = state.data.filter((item) => {
        return item.id !== action.payload;
      });
      state.data = updated;
    },
  },
});

export const { changeSearchTerm, addArt, removeArt } = artSlice.actions;
export const artReducer = artSlice.reducer;

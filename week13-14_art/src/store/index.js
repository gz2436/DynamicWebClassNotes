import { configureStore } from '@reduxjs/toolkit';
import {
  artReducer,
  addArt,
  removeArt,
  changeSearchTerm,
} from './slices/artSlice';
import { formReducer, changeName, changePrice } from './slices/formSlice';

const store = configureStore({
  reducer: {
    art: artReducer,
    form: formReducer,
  },
});

export { store, changeName, changePrice, addArt, removeArt, changeSearchTerm };

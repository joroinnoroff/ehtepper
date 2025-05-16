import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice';
import stockReducer from './features/setStock';
import checkoutReducer from './features/checkoutVipps';
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    stock: stockReducer,
    checkout: checkoutReducer, // Include the stock reducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

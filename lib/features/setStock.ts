import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../lib/store';

interface StockItem {
  id: number;
  stock: number;
}

interface StockState {
  stock: StockItem[];
}

const initialState: StockState = {
  stock: [],
};

export const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStock: (state, action: PayloadAction<StockItem[]>) => {
      state.stock = action.payload;
    },
    updateStock: (state, action: PayloadAction<{ id: number; qty: number }>) => {
      const stockItem = state.stock.find((item) => item.id === action.payload.id);
      if (stockItem) {
        stockItem.stock -= action.payload.qty;
      }
    },
  },
});

export const { setStock, updateStock } = stockSlice.actions;

export const selectStockById = (state: RootState, id: number) =>
  state.stock.stock.find((item) => item.id === id)?.stock;

export default stockSlice.reducer;

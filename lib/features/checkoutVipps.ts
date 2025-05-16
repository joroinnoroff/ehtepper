import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
  vippsReference: string | null;
  vippsCheckoutUrl: string | null;
}

const initialState: CheckoutState = {
  vippsReference: null,
  vippsCheckoutUrl: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setVippsSession: (state, action: PayloadAction<{ reference: string; checkoutUrl: string }>) => {
      state.vippsReference = action.payload.reference;
      state.vippsCheckoutUrl = action.payload.checkoutUrl;
    },
    clearVippsSession: (state) => {
      state.vippsReference = null;
      state.vippsCheckoutUrl = null;
    },
  },
});

export const { setVippsSession, clearVippsSession } = checkoutSlice.actions;
export default checkoutSlice.reducer;

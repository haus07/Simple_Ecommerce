import { configureStore } from "@reduxjs/toolkit";
import cartReducer from '../features/cart/cartSlice'
import orderReducer from '../features/order/orderSlice'
import { loadState, saveState } from "./localstorage";

const persistedState = loadState()

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        order:orderReducer,
    },
    preloadedState:persistedState
})


store.subscribe(() => {
    saveState(store.getState())
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
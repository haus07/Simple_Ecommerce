import { createSlice, type PayloadAction     } from "@reduxjs/toolkit";
interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  description: string; // sửa lại chính tả từ desciption → description
  images: string[];
  thumbnail: string;
  rating: number | string; // backend trả "5" nên tạm cho string | number
  price: string;
}

interface OrderItem {
  id: number;
  quantity: number | string; // backend trả "1"
  product: Product;
}

interface Order {
  id?: number;
  orderDate?: string;
  totalPrice?: string;
  status?: string;
  items: OrderItem[];
}

const initialState: Order = {
  id: undefined,
  orderDate: '',
  totalPrice: '',
  status: '',
  items: [],
};

export const orderSilce = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<OrderItems[]>) {
            return{...state,...action.payload}
      },
      updateOrderStatus(state, action: PayloadAction<{ orderId: number, status: string }>) {
        state.status = action.payload.status
      }
    }
})

export const { setItems ,updateOrderStatus} = orderSilce.actions
export default orderSilce.reducer

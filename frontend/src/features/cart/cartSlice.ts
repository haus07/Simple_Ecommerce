import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Cart } from './../../../../backend/src/entities/cart.entity';
import { Product } from "../../../../backend/src/entities/product.entity";
import { countCartItems, updateQuantityByCartId } from "../../app/middleware/apiMiddleware";
import { UpdateQuantity } from './../../../../backend/src/managements/cart/dtos/updateQuantity.dto';



interface Product{
    id: number,
    title: string,
    brand: string,
    category: string,
    desciption: string,
    images: string[],
    thumbnail: string,
    rating: number,
    price:string
}


interface CartItem{
    id: number,
    quantity: number,
    selected: boolean,
    product:Product
}

interface Cart{
    items: CartItem[]
    count:number
}

 const initialState: Cart={
     items: [],
     count:0
}



export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateQuantity(state, action: PayloadAction<{ productId: number, quantity: number }>) {
            const item = state.items.find(item => item.id === action.payload.productId)
            if (item) {
                item.quantity = Math.max(1, action.payload.quantity)
            }
            localStorage.setItem('cart_items',JSON.stringify(state))
        },
        setItems(state,action:PayloadAction<CartItem[]>) {
            state.items = action.payload
        },
        addItems(state, action: PayloadAction<CartItem>) {
            state.items = state.items.push(action.payload)
        },
        toggleSelected(state,action:PayloadAction<{productId:number}>) {
            const item = state.items.find(item => item.id === action.payload.productId)
            if (!item) {
                return
            } else {
                item.selected = !item.selected
            }
        },
        removeItem(state, action: PayloadAction<{ productId: number }>) {
            const item = state.items.find(item => item.id === action.payload.productId)
            if (!item) {
                return
            } else {
                 state.items = state.items.filter(item=>item.id !== action.payload.productId)
            }
            
        },
        selectedAllItems(state) {
            const allSelected = state.items.every(item => item.selected)
            state.items = state.items.map(item=>({...item,selected:!allSelected}))
        },
        increment(state, action:PayloadAction<{quantity:number,productId:number}>) {
            console.log(action.payload.quantity)
            console.log(action.payload.productId)
            const product = state.items.find(item => item.product.id === action.payload.productId)
            if (product){
                return 
            }
            else {
                state.count += action.payload.quantity
            }
        },
        descrement(state, action) {
            state.count -= action.payload
        }
    },
    extraReducers:(builder)=> {
        builder
            .addCase(updateQuantityByCartId.fulfilled, (state, action) => {
                state.loading = false
                state.status = "Succeeded"
                const updateItem = action.payload.updateItem
                if (updateItem.quantity === 0) {
                    state.items = state.items.filter(item => item.id !== updateItem.id)
                    state.count--
                } else {
                    const index = state.items.findIndex(item => item.id === updateItem.id)
                    if (index !== -1) {
                        state.items[index].quantity = updateItem.quantity 
                    } 
                }
            })
            .addCase(countCartItems.fulfilled, (state,action)=> {
                state.count = action.payload
                                
            })
    }
})
    
export const { updateQuantity ,setItems,toggleSelected,removeItem,selectedAllItems,addItems,increment,descrement} = cartSlice.actions

export default cartSlice.reducer

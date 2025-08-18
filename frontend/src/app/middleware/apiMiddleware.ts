import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios/axios";


//  minh se dinh nghia interface o day

interface UpdateQuantityPayload{
    
    cartItemId: number,
    quantity:number
}

interface DeleteCartItemPayload{
    cartItemId:number
}

export const updateQuantityByCartId = createAsyncThunk(
    'cart/updateQantityById',
    async ({ cartItemId, quantity}:UpdateQuantityPayload) => {
        const accessToken = localStorage.getItem('access_Token')
        const response = await api.patch(`api/v1/carts/${cartItemId}`, {
            quantity:quantity
        }, {
            headers:{Authorization:`Bearer ${accessToken}`}
        })
        return response.data  // as interface
    }

)

export const countCartItems = createAsyncThunk(
    'cart/countCartItems',
    async () => {
        const accessToken = localStorage.getItem('access_Token')
        const response = await api.get('api/v1/carts/count',
            {
                headers: {Authorization:`Bearer ${accessToken}`}
            }
        )
        return response.data.count
    }
)


export const removeCartItems = createAsyncThunk(
    'cart/deleteCartItem',
    async ({ cartItemId }:DeleteCartItemPayload) => {
        const accessToken = localStorage.getItem('access_Token')
        const response = await api.delete(`cart/${cartItemId}/cartItem`, {
            headers:{Authorization:`Bearer ${accessToken}`}
        })
        return response.data
    }
)



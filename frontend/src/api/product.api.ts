import api from "../axios/axios";

interface Product{
    id: number
    title: string
    brand: string
    category: string
    description: string
    images: string[]
    thumbnail: string
    rating: string
    price:number
}

export const getAllProduct = async (
    page: number,
    limit: number,
    searchQuery: string,
    sortBy: string,
    sortOrder: string,
    categoryFilter: string,
    minPrice: number,
    maxPrice:number
) :Promise<Product[]>=> {
    const repsponse = await api.get(`api/v1/products`, {
        params: {
            page, 
            limit, 
            searchQuery, 
            sortBy, 
            sortOrder,
            categoryFilter,
            minPrice,
            maxPrice
        }
    })
    return repsponse.data
}

export const updateProduct = async (
    accessToken: string,
    body: Product,
    id:number
) => {
    const response = await api.patch(`api/v1/products/${id}`, body, {
        headers: {Authorization:`Bearer ${accessToken}`}
    })
    return response.data
}

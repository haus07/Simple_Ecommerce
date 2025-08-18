import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllProduct, updateProduct } from "../../api/product.api"

interface Product{
    id: number
    title: string
    brand: string
    category: string
    description: string
    rating: string
    price:number
}

export const useProduct = (
    page: number,
    limit: number,
    searchQuery?: string,
    sortBy?: string,
    sortOrder?: string,
    categoryFilter?: string,
    minPrice: number,
    maxPrice:number) => {
    console.log(sortOrder)
    console.log(sortBy)
    return useQuery({
        queryKey: ['products',
            page, 
            limit, 
            searchQuery, 
            sortBy, 
            sortOrder,
            categoryFilter,
            minPrice,
            maxPrice],
        queryFn: () => getAllProduct(
            page, 
            limit, 
            searchQuery, 
            sortBy, 
            sortOrder,
            categoryFilter,
            minPrice,
            maxPrice),
        keepPreviousData:true
    })
}
    
export const useUpdateProduct = (accessToken: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, body }: { id: number; body: Product }) => 
            updateProduct(accessToken, body, id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['products']})
        }
        
    })
}
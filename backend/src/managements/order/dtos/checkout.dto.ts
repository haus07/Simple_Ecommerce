


interface OrderItemsDto{
    
    quantity: number
    productId: number
    originalCartItemId:number
}

interface CheckoutDto{
    items: OrderItemsDto[]
}
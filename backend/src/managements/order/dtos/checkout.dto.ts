


interface OrderItemsDto{
    
    quantity: number
    productId: number
}

interface CheckoutDto{
    items: OrderItemsDto[]
}
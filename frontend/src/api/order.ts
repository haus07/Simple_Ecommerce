import api from "../axios/axios";

export interface Order {
    id: number;
    user: {
        id: number; // Thêm ID của user nếu có
        username: string;
        email: string;
        phone: string;
        status: string;
    };
    status: string;
    totalPrice: number;
    orderDate: string; // Thêm orderDate để hiển thị
    // Thêm các thuộc tính khác của Order nếu có (ví dụ: items)
}

export const getAllOrders = async (
    accessToken: string,
    page: number,
    limit: number,
    seachQuery: string,
    sortBy: string,
    sortOrder: string,
    statusFilter:string
) :Promise<Orderp[]|null>=> {
    const response = await api.get(`api/v1/orders`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
            page,
            limit,
            seachQuery,
            sortBy,
            sortOrder,
            statusFilter
        }
    })
    return (await response).data
}

export const getAllOrderByUserId = async (
    accessToken: string,
    page: number,
    limit: number,
    searchQuery: string,
    sortBy: string,
    sortOrder: string,
    statusFilter:string
):Promise<Order>|null => {
    const response = await api.get('api/v1/orders/me',
        {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                page,
                limit,
                searchQuery,
                sortBy,
                sortOrder,
                statusFilter
            }
        }
    )
    return await response.data
}


export const updateStatusOrder = async (
    accessToken: string,
    status: string,
    id:number
) => {
    console.log("Status sending:", JSON.stringify(status));
    const resposne = await api.patch(`api/v1/orders/${id}`, 
        {
            status:status
        },
        {
            headers: {Authorization:`Bearer ${accessToken}`}
        }
    )

    return resposne.data
}
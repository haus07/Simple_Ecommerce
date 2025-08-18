import api from "../axios/axios"

interface User{
    
    id: number;
    username: string;
    email: string;
    phone: string;
    status: string;
    // Thêm roles nếu bạn đã khai báo trong AuthContext
    roles?: { name: string }[];

}

export const getAllUser = async (
    accessToken: string,
    page: number,
    limit: number,
    searchQuery?: string,
    sortBy?: string,
    sortOrder?: string,
    statusFilter?:string
    ): Promise<User[] | null> => {
    const response = await api.get(`api/v1/users`,
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
    return response.data
} 

export const updateUser = async (
    accessToken: string,
    body: Partial<User>,
    id:number) => {
    const response = await api.patch(`api/v1/users/${id}`,
        body, {
        headers:{Authorization:`Bearer ${accessToken}`}
    })
    return response.data
}
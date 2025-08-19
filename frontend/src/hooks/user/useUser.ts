import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllUser, updateUser } from "../../api/user.api"
import { keepPreviousData } from './../../../node_modules/@tanstack/query-core/src/utils';

export const useUsers = (
    accessToken: string,
    page: number,
    limit: number,
    searchQuery: string,
    sortBy: string,
    sortOrder: string,
    statusFilter:string
) => {
return useQuery({
    queryKey: ['users', page, limit,searchQuery,sortBy,sortOrder,statusFilter],
    queryFn: () => getAllUser(accessToken, page, limit,searchQuery,sortBy,sortOrder,statusFilter),
    keepPreviousData:true
})
}


export const useUpdateUser = (accessToken: string) => {
const queryClient = useQueryClient()
return useMutation({
    mutationFn: ({ id, body }: { id: number, body: any }) =>
        updateUser(accessToken, body, id),
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey:['users']
        })
    }
})
    

}
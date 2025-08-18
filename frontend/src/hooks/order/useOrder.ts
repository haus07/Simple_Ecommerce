// src/hooks/order/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrderByUserId, getAllOrders, updateStatusOrder } from "../../api/order";

export const useOrders = (
  accessToken: string,
  page: number,
  limit: number,
  searchQuery: string,
  sortBy: string,
  sortOrder: string,
  statusFilter:string
) => {
  return useQuery({
    queryKey: ["orders", page, limit,searchQuery,sortBy,sortOrder,statusFilter],
    queryFn: () => getAllOrders(accessToken, page, limit,searchQuery,sortBy,sortOrder,statusFilter),
    keepPreviousData: true,
  });
};

export const useOrdersByUserId= (
  accessToken: string,
  page: number,
  limit: number,
  searchQuery: string,
  sortBy: string,
  sortOrder: string,
  statusFilter:string
) => {
  return useQuery({
    queryKey: ["user-orders", page, limit,searchQuery,sortBy,sortOrder,statusFilter],
    queryFn: () => getAllOrderByUserId(accessToken, page, limit,searchQuery,sortBy,sortOrder,statusFilter),
    keepPreviousData: true,
  });
};



export const useUpdateStatusOrder = (accessToken: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: string;
    }) => updateStatusOrder(accessToken, status, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

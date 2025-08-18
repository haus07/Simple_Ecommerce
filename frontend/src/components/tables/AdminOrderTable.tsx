// src/components/tables/AdminOrderTable.tsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useOrders, useUpdateStatusOrder } from "../../hooks/order/useOrder";

interface AdminOrderTableProps {
  accessToken: string;
}

export default function AdminOrderTable({ accessToken }: AdminOrderTableProps) {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // State mới cho Tìm kiếm
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // State mới cho Sắp xếp
  const [sortBy, setSortBy] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("desc");

  // State mới cho Lọc trạng thái
  const [statusFilter, setStatusFilter] = useState("all");

  // Cập nhật hook useOrders để nhận các tham số mới
  const { data, isLoading, isError, error } = useOrders(
    accessToken,
    page,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    statusFilter
  );
  const updateStatusMutation = useUpdateStatusOrder(accessToken);

  const totalPages = data?.totalPages || 1;
  const orders = data?.data || [];

  // Sử dụng useEffect để reset page về 1 khi có bất kỳ thay đổi nào về bộ lọc
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy, sortOrder, statusFilter]);

  const handleStatusChange = (orderId: number, newStatus: string) => {
    console.log(newStatus);
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSearchQuery(searchInput);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-2xl font-bold text-white mb-2">Danh sách đơn hàng</h3>
        <p className="text-gray-400">Quản lý tất cả đơn hàng trong hệ thống</p>
      </div>
      
      {/* --- Control Panel: Search, Filter, Sort --- */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-auto flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên người dùng..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="w-full md:w-auto">
          <label htmlFor="sortBy" className="sr-only">Sắp xếp theo</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >

            <option value="totalPrice">Tổng giá</option>
            <option value="createdAt">Ngày tạo</option>
            <option value="updatedAt">Ngày cập nhật</option>
          </select>
        </div>

        {/* Sort Order Dropdown */}
        <div className="w-full md:w-auto">
          <label htmlFor="sortOrder" className="sr-only">Thứ tự sắp xếp</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full appearance-none bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>
        
        {/* Status Filter Dropdown */}
        <div className="w-full md:w-auto">
          <label htmlFor="statusFilter" className="sr-only">Lọc theo trạng thái</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Pending</option>
            <option value="wait for paid">Wait for paid</option>
            <option value="confirmed">Confirmed</option>
            <option value="succeeded">Succeeded</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>
      {/* --- End of Control Panel --- */}
      
      {isLoading && <div className="p-6 text-center text-gray-400">Đang tải đơn hàng...</div>}
      {isError && <div className="p-6 text-center text-red-400">{(error as Error).message}</div>}
      {!isLoading && !isError && orders.length === 0 && (
        <div className="p-6 text-center text-gray-400">Không có đơn hàng nào để hiển thị.</div>
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Tên người dùng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">SĐT</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Tổng giá trị</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-white">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{order.user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{order.user.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">${Number(order.totalPrice).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-transparent border border-white/20 rounded-md p-1 text-white text-sm"
                      >
                        <option value="pending" className="bg-gray-800 text-white">Pending</option>
                        <option value="wait for paid" className="bg-gray-800 text-white">Wait for paid</option>
                        <option value="confirmed" className="bg-gray-800 text-white">Confirmed</option>
                        <option value="succeeded" className="bg-gray-800 text-white">Succeeded</option>
                        <option value="canceled" className="bg-gray-800 text-white">Canceled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 flex justify-center items-center space-x-4 border-t border-white/10">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                disabled={page === index + 1}
                className={`px-4 py-2 rounded-lg ${
                  page === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
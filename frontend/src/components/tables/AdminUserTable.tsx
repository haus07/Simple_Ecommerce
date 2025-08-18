import { useState, useEffect } from "react"
import { Edit, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useUsers, useUpdateUser } from "../../hooks/user/useUser";
import EditUserModal from "../../modal/EditUserModal";

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  status: string;
  roles?: { name: string }[];
}

export default function AdminUserTable({
  accessToken
}: {
  accessToken: string;
}) {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // State cho Tìm kiếm
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // State cho Sắp xếp
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // State cho lọc
  const [statusFilter] = useState("active");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Hook gọi API với các tham số mới
  const { data, isLoading, isError } = useUsers(accessToken, page, limit, searchQuery, sortBy, sortOrder, statusFilter);
  const updateUserMutation = useUpdateUser(accessToken);

  const handleEdit = (u: User) => {
    setSelectedUser(u);
    setIsModalOpen(true);
  }

  const handleSoftDelete = (id: number) => {
    console.log("Soft delete user", id)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSearchQuery(searchInput);
      setPage(1); // Reset về trang 1 khi tìm kiếm
    }
  };

  // Reset page về 1 khi các tham số lọc/sắp xếp thay đổi
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy, sortOrder, statusFilter]);

  const users: User[] = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden mb-8">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-2xl font-bold text-white mb-2">Danh sách người dùng đang hoạt động</h3>
        <p className="text-gray-400">Quản lý tất cả người dùng trong hệ thống</p>
      </div>

      {/* Control Panel: Search, Filter, Sort */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-auto flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="w-full md:w-auto">
          <label   htmlFor="sortBy" className="sr-only">Sắp xếp theo</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1); // Reset page
            }}
            className="w-full appearance-none bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="createdAt">Ngày tạo</option>
            <option value="updatedAt">Ngày cập nhật</option>
            <option value="username">Tên người dùng</option>
            <option value="email">Email</option>
            <option value="phone">Số điện thoại</option>
          </select>
        </div>

        {/* Sort Order Dropdown */}
        <div className="w-full md:w-auto">
          <label htmlFor="sortOrder" className="sr-only">Thứ tự sắp xếp</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1); // Reset page
            }}
            className="w-full appearance-none bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="desc">Thứ tự giảm dần</option>
            <option value="asc">Thứ tự tăng dần</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="p-6 text-center text-gray-400">Đang tải người dùng...</div>
      )}
      {isError && (
        <div className="p-6 text-center text-red-400">Lỗi khi tải người dùng.</div>
      )}
      {!isLoading && !isError && users.length === 0 && (
        <div className="p-6 text-center text-gray-400">Không có người dùng nào để hiển thị.</div>
      )}

      {!isLoading && !isError && users.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">SĐT</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Chức năng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-white">{u.id}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{u.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{u.phone}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(u)}
                          className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleSoftDelete(u.id)}
                          className="inline-flex items-center space-x-2 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Xóa</span>
                        </button>
                      </div>
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
       <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={selectedUser}
        onUserUpdated={() => setIsModalOpen(false)}
        updateUserMutation={()=>updateUserMutation}
      />
      </div>
  )
}
import { useState, useEffect } from "react";
import { Edit, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useProduct, useUpdateProduct } from "../../hooks/product/useProduct";
import EditProductModal from "../../modal/EditProductModal";

interface AdminProductTableProps {
  accessToken: string;
}

interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  description: string;
  rating: string;
  price: number;
  thumbnail: string;
}

// Interface này cần phải được định nghĩa để sử dụng
interface UpdateProduct {
  title: string;
  brand: string;
  category: string;
  description: string;
  rating: string;
  price: number;
}

export default function AdminProductTable({ accessToken }: AdminProductTableProps) {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // State mới cho Tìm kiếm
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // State mới cho Sắp xếp
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // State mới cho Lọc
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [formData, setFormData] = useState<UpdateProduct | null>(null);

  // Cập nhật hook useProduct để nhận các tham số mới
  // Lưu ý: Nếu hook của bạn chưa hỗ trợ các tham số này, bạn cần phải cập nhật nó.
  const { data, isLoading, isError, error } = useProduct(
    page, 
    limit, 
    searchQuery, 
    sortBy, 
    sortOrder,
    categoryFilter
  );
  
  const updateProductMutation = useUpdateProduct(accessToken);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = data?.data || [];
  const totalPages = data?.totalPages || 1;

  // Sử dụng useEffect để reset page về 1 khi có bất kỳ thay đổi nào về bộ lọc
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy, sortOrder, categoryFilter]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      brand: product.brand,
      category: product.category,
      description: product.description,
      rating: product.rating,
      price: product.price,
    });
    setIsModalOpen(true);
  };

  const handleSoftDelete = (id: number) => {
    console.log("Delete product id:", id);
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
        <h3 className="text-2xl font-bold text-white mb-2">Danh sách sản phẩm</h3>
        <p className="text-gray-400">Quản lý tất cả sản phẩm trong hệ thống</p>
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
            placeholder="Tìm kiếm theo tên sản phẩm..."
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
            <option value="createdAt">Ngày tạo</option>
            <option value="updatedAt">Ngày cập nhật</option>
            <option value="title">Tên</option>
            <option value="price">Giá</option>
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
            <option value="desc">Thứ tự giảm dần</option>
            <option value="asc">Thứ tự tăng dần</option>
          </select>
        </div>

        {/* Category Filter Dropdown */}
        <div className="w-full md:w-auto">
          <label htmlFor="categoryFilter" className="sr-only">Loại sản phẩm</label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full appearance-none bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="all">Tất cả loại sản phẩm</option>
            <option value="Headphones">Headphones</option>
            <option value="Smartphone">SmartPhone</option>
            <option value="Shoes">Shoes</option>
            <option value="Laptop">Laptop</option>
            <option value="Camera">Camera</option>
            <option value="Tablet">Tablet</option>
            <option value="Accessories">Accessories</option>
            <option value="Wearable">Wearable</option>
          </select>
        </div>
      </div>

      {isLoading && <div className="p-6 text-center text-gray-400">Đang tải sản phẩm...</div>}

      {isError && <div className="p-6 text-center text-red-400">{(error as Error).message}</div>}

      {!isLoading && !isError && products.length === 0 && (
        <div className="p-6 text-center text-gray-400">Không có sản phẩm nào để hiển thị.</div>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Tên sản phẩm</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Hình ảnh</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Loại sản phẩm</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Chức năng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-white">{product.id}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{product.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-700"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleSoftDelete(product.id)}
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
      <EditProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onUpdateSuccess={() => {
          alert('Cập nhật sản phẩm thành công')
          setIsModalOpen(false)}
        }
      />
    </div>
  );
}
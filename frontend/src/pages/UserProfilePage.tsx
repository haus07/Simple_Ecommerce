import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShoppingBag, 
  Package, 
  Calendar, 
  Eye,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
  Star,
  Settings,
  Edit2,
  LogOut,
  Search,
  ChevronLeft,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createSearchParams, useNavigate } from 'react-router-dom';
import api from '../axios/axios';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { setItems } from '../features/order/orderSlice';
import { useOrdersByUserId } from '../hooks/order/useOrder';
import { orderSilce } from './../features/order/orderSlice';

// --- Interfaces ---

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  joinDate?: string;
}

interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  description: string; // sửa lại chính tả từ desciption → description
  images: string[];
  thumbnail: string;
  rating: number | string; // backend trả "5" nên tạm cho string | number
  price: string;
}

interface OrderItem {
  id: number;
  quantity: number | string; // backend trả "1"
  product: Product;
}

interface Order {
  id?: number;
  orderDate?: string;
  totalPrice?: string;
  status?: string;
  items?: OrderItem[];
}

const UserProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // States cho phân trang, tìm kiếm, lọc
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const accessToken = localStorage.getItem('access_Token')
  
  // Sử dụng custom hook đã tạo
  const { data, isLoading, isError, error, refetch } = useOrdersByUserId(
    accessToken,
    page, 
    limit, 
    searchQuery, 
    sortBy, 
    sortOrder,
    statusFilter
  );

  const totalPages = data?.totalPages || 1;
  const orders = data?.data || [];

  // Reset page về 1 khi các filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy, sortOrder, statusFilter]);
  
  // Hàm xử lý khi người dùng ấn Enter để tìm kiếm
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSearchQuery(searchInput);
    }
  };

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Hàm chuyển đổi màu sắc trạng thái
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800 border-gray-300',
      'wait for paid': 'bg-gray-100 text-gray-800 border-gray-300',
      confirmed: 'bg-black text-white border-black',
      succeeded: 'bg-black text-white border-black',
      canceled: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || colors.pending;
  };

  // Hàm chuyển đổi icon trạng thái
  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      'wait for paid': <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      succeeded: <CheckCircle className="w-4 h-4" />,
      canceled: <X className="w-4 h-4" />
    };
    return icons[status] || icons.pending;
  };

  // Hàm định dạng ngày
const formatDate = (dateString: string) => {
  // `vi-VN` mặc định sẽ trả về định dạng `dd/mm/yyyy`
  return new Date(dateString).toLocaleDateString('vi-VN');
};

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Profile</h1>
            <p className="text-gray-600">Your infomations and orders</p>
          </div>
          <div className="flex items-center justify-between">
          <button
              onClick={() => {
                navigate('/main')
            }}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-black hover:bg-black hover:text-white text-black hover:text-black rounded-lg transition-all duration-200 mr-10"
            >
            <LogOut className="w-5 h-5" />
            <span>Homepage</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-black hover:bg-black hover:text-white text-black hover:text-black rounded-lg transition-all duration-200"
            >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
              </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-sm object-cover"
                  />
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-black rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-black mt-4 mb-2">{user.username}</h2>
                <p className="text-gray-600">  {user.joinDate}</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="text-black font-semibold">{user.username}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-black font-semibold">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-black font-semibold">{user.phone}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
                  <Edit2 className="w-5 h-5" />
                  <span>Edit your profile</span>
                </button>
              </div>
            </div>
          </div>
          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-black">Orders</h3>
                      <p className="text-gray-600">Total {data?.total || 0} orders</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Control Panel: Search, Filter, Sort --- */}
              <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row items-center gap-4">
                {/* Search Input */}
                <div className="relative w-full md:w-auto flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Looks your order here..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all duration-200"
                  />
                </div>

                {/* Sort By Dropdown */}
                <div className="w-full md:w-auto">
                  <label htmlFor="sortBy" className="sr-only">Order by</label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:border-black transition-all duration-200"
                  >
                    <option value="createdAt">Order date</option>
                    <option value="totalPrice">Total price</option>
                  </select>
                </div>

                {/* Sort Order Dropdown */}
                <div className="w-full md:w-auto">
                  <label htmlFor="sortOrder" className="sr-only">Sort by</label>
                  <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full appearance-none border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:border-black transition-all duration-200"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
                
                {/* Status Filter Dropdown */}
                <div className="w-full md:w-auto">
                  <label htmlFor="statusFilter" className="sr-only">Status filtes</label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:border-black transition-all duration-200"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="wait for paid">Wait for paid</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="succeeded">Succeeded</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
              {/* --- End of Control Panel --- */}

              {/* Orders List */}
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {isLoading && <div className="text-center py-8 text-gray-600">Loading...</div>}
                {isError && <div className="text-center py-8 text-red-600">Lỗi: {(error as Error).message}</div>}
                {!isLoading && !isError && orders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Looks like the order book is empty</p>
                  </div>
                )}
                {!isLoading && orders.length > 0 && (
                  orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-black font-semibold">#{order.orderCode}</p>
                            <p className="text-sm text-gray-600 flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(order.createdAt)}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-black">${Number(order.totalPrice).toFixed(2)}</p>
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="flex items-center space-x-2 mb-3">
                        {order.items?.slice(0, 3).map((item: any) => (
                          <img
                            key={item.id}
                            src={item.product.thumbnail}
                            alt={item.product.title}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                        ))}
                        {order.items && order.items.length > 3 && (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                            <span className="text-xs text-gray-600">+{order.items.length - 3}</span>
                          </div>
                        )}
                        <span className="text-sm text-gray-600 ml-2">
                          {order.items?.length === 1 ?
                          order.items?.length + ' product':order.items?.length+' products'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleViewOrder(order)}
                        className="w-full border border-gray-300 hover:border-black text-gray-700 hover:text-black py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Click for details</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {/* Pagination */}
              <div className="p-6 flex justify-center items-center space-x-4 border-t border-gray-200">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isLoading}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:border-black text-gray-700 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-black">Page {page} / {totalPages}</span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || isLoading}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:border-black text-gray-700 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-black">Order details</h3>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Order Id</p>
                      <p className="text-black font-semibold">#{selectedOrder.orderCode}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Order date</p>
                      <p className="text-black font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-black font-semibold mb-3">Your order</h4>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 bg-gray-50 border border-gray-200 p-3 rounded-lg">
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.title}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                          <div className="flex-1">
                            <p className="text-black font-medium">{item.product.title}</p>
                            <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <p className="text-black font-semibold">${(Number(item.product.price) * Number(item.quantity)).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-black">Total:</span>
                    <span className="text-2xl font-bold text-black">${Number(selectedOrder.totalPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
// src/pages/AdminDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../axios/axios';
import { HttpStatusCode } from 'axios';
import {
    Users,
    ShoppingCart,
    Package,
    UserPlus,
    LogOut,
    User,
    Edit,
    Trash2,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Settings,
  Shield,
  ChevronLeft,
  
} from 'lucide-react';

import EditUserModal from '../modal/EditUserModal';
import CreateUserModal from '../modal/CreateUserModal';
import { Product } from './../../../backend/src/entities/product.entity';
import EditProductModal from '../modal/EditProductModal';
import AdminUserTable from '../components/tables/AdminUserTable';
import AdminProductTable from '../components/tables/AdminProductTable';
import AdminOrderTable from '../components/tables/AdminOrderTable';

// --- Giao diện (interface) cho User ---
export interface User {
    id: number;
    username: string;
    email: string;
    phone: string;
    status: string;
    // Thêm roles nếu bạn đã khai báo trong AuthContext
    roles?: { name: string }[];
}

// --- Giao diện (interface) cho Order ---
// Cập nhật interface Order để phản ánh cấu trúc trả về từ backend
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

interface Product{
    id: number
    title: string
    brand: string
    category: string
    description: string
    images: string[]
    thumbnail: string
    rating: string
    price:number
}

const AdminDashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // --- User Management States ---
    const [users, setUsers] = useState<User[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State để mở/đóng modal chỉnh sửa
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    // --- Order Management States ---
    const [orders, setOrders] = useState<Order[]>([]); // Đã sửa: phải là Order[]
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageForUsers, setCurrentPageForUsers] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1); // Đã sửa: Khởi tạo là 1 để tránh chia cho 0
    const [totalPagesForUser, setTotalPagesForUser] = useState(1); // Đã sửa: Khởi tạo là 1 để tránh chia cho 0
    const [shouldFetchOrders, setShouldFetchOrders] = useState(false); // State kích hoạt fetch
    const [shouldFetchUser,setShouldFetchUser] = useState(false)
    const [ordersLoading, setOrdersLoading] = useState(false); // State loading cho orders
    const [ordersError, setOrdersError] = useState<string | null>(null); // State error cho orders
    const [shouldFetchProduct, setShouldFetchProduct] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [totalPagesForProduct, setTotalPageForProduct] = useState([])
    const [displayOrder, setDisplayOrder] = useState(false)
    const [currentPageForProducts, setCurrentPageForProducts] = useState(1)
    
    const [selectedProduct, setSelectedProduct] = useState<Product>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
      const [activeTab, setActiveTab] = useState<"products" | "orders" | "users">(
    "users"
    );
    ////////////////////////////////////////////////////
    

    const pageSize = 10;

   

    // --- useEffect để Fetch Orders (có phân trang) ---
  
    


     

    // --- Hàm xử lý chuyển trang ---
    const handlePageChange = (page: number) => {
        if (displayUser && page > 0 && page <= totalPagesForUser) {
            setCurrentPageForUsers(page)
            setShouldFetchUser(true)
        }

        if (displayOrder && !displayUser&& page > 0 && page <= totalPages) {
            setCurrentPage(page);
            setShouldFetchOrders(true); // Kích hoạt fetch khi chuyển trang
        }

        if (!displayOrder &&!displayUser && page > 0 && page <= totalPagesForProduct) {
            setCurrentPageForProducts(page)
            setShouldFetchProduct(true)
        }
    };

    const accessToken = localStorage.getItem("access_Token") || "";

  const handleUpdateSuccess = () => {
    // Logic của bạn sau khi cập nhật thành công, ví dụ:
    // - Tải lại danh sách sản phẩm
      // - Hiển thị thông báo thành công
      setShouldFetchProduct(true)
    console.log("Cập nhật sản phẩm thành công!");
    alert("Cập nhật sản phẩm thành công!");
  };



    const [displayUser,setDisplayUser] = useState(false)

    // --- Hàm kích hoạt hiển thị và fetch đơn hàng ---
    const handleShowOrders = () => {
        // Mẹo dùng setTimeout để buộc state thay đổi từ true -> false -> true
        // Điều này đảm bảo useEffect luôn nhận thấy sự thay đổi và chạy lại
        setShouldFetchOrders(false);
        setCurrentPage(1); // Reset về trang đầu tiên khi bấm nút này
        setTimeout(() => {
            setShouldFetchOrders(true);
        }, 0);
    };

    const handleShowProducts = () => {
        // Mẹo dùng setTimeout để buộc state thay đổi từ true -> false -> true
        // Điều này đảm bảo useEffect luôn nhận thấy sự thay đổi và chạy lại
        setShouldFetchProduct(false);
        setCurrentPageForProducts(1); // Reset về trang đầu tiên khi bấm nút này
        setTimeout(() => {
            setShouldFetchProduct(true);
        }, 0);
    };

    const handleShowUsers = () => {
        // Mẹo dùng setTimeout để buộc state thay đổi từ true -> false -> true
        // Điều này đảm bảo useEffect luôn nhận thấy sự thay đổi và chạy lại
        setShouldFetchUser(false);
        setCurrentPageForUsers(1); // Reset về trang đầu tiên khi bấm nút này
        setTimeout(() => {
            setShouldFetchUser(true);
        }, 0);
    };

    // --- Hàm thay đổi trạng thái đơn hàng ---
    const handleStatusChange = async (orderId: number, status: string) => {
        try {
            const accessToken = localStorage.getItem('access_Token');
            if (!accessToken) {
                navigate('/login');
                return;
            }
            // Backend có thể không cần totalPrice khi chỉ cập nhật status
            const response = await api.put(`api/v1/orders/${orderId}`, {
                status: status,
                // totalPrice: 999 // Có thể bỏ nếu backend không yêu cầu
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (response.data.success === true) {
                // Sau khi cập nhật thành công, fetch lại danh sách đơn hàng
                // để UI được cập nhật
                setShouldFetchOrders(true);
                alert('Thay đổi trạng thái thành công!');
            }
        } catch (error: any) {
            console.error('Lỗi khi thay đổi trạng thái:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            alert('Lỗi khi thay đổi trạng thái!');
        }
    };

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const handleCreate = () => {
        setIsCreateModalOpen(true);
    };
    // --- User Management Functions (không thay đổi nhiều) ---
    const handleGoToUser = () => {
        navigate('/main');
    };

    const fetchAllUser = async (accessToken: string) => {
        try {
            const response = await api.get('api/v1/users', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setUsers(response.data);
            setDisplayUser(true)
        } catch (error: any) {
            if (error.response?.status === 401) {
                navigate('/login');
            }
            console.error('Fetch all users failed:', error);
        }
    };

     const handleEditClick = (product) => {
    setSelectedProduct(product); // Giả sử chúng ta đã lấy được sản phẩm từ danh sách
    setIsModalOpen(true);
  };

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]); // Mặc định không mở
    const toggleMenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };


    const softDelete = async (accessToken: string, id: number) => {
        try {
            const response = await api.patch(`api/v1/users/soft-delete/${id}`, null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.status === HttpStatusCode.Ok) {
                await fetchAllUser(accessToken); // Cập nhật danh sách sau xoá
                alert('Đã vô hiệu hoá người dùng!');
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                navigate('/login');
            }
            alert('Lỗi khi xoá mềm người dùng!');
        }
    };

    const handleFetchAllUser = async () => {
        const accessToken = localStorage.getItem('access_Token');
        if (accessToken) {
            await fetchAllUser(accessToken);
        } else {
            alert('Bạn chưa đăng nhập!');
            navigate('/login');
        }
    };

    const handleSoftDelete = async (id: number) => {
        const accessToken = localStorage.getItem('access_Token');
        if (!accessToken) return;
        await softDelete(accessToken, id);
    };

   

     const handleEdit = (user: User) => {
      // Đảm bảo user.roles là một mảng string
      const rolesAsStringArray = user.roles ? user.roles.map(role => role.name) : [];
      setUserToEdit({ ...user, roles: rolesAsStringArray });
      setIsEditModalOpen(true);
    };

      const handleUserUpdated = () => {
        // Callback này sẽ được gọi từ EditUserModal khi cập nhật thành công
        // Sau đó chúng ta sẽ fetch lại danh sách người dùng để hiển thị dữ liệu mới nhất
        const accessToken = localStorage.getItem('access_Token');
        if (accessToken) {
          fetchAllUser(accessToken);
        }
    };
    const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
};

    console.log(totalPagesForProduct)

    // Nếu chưa có user thì hiển thị loading
    if (!user) {
        return <div>Đang tải thông tin người dùng...</div>;
    }
    console.log(orders);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-gray-800/95 backdrop-blur-sm border-r border-gray-700/50 transition-all duration-300 ease-in-out relative`}>
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            {sidebarOpen && (
                                <div>
                                    <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                                    <p className="text-sm text-gray-400">Dashboard</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4 space-y-2">
                    {/* Quản lý người dùng */}
                    <div>
                        <button
                            onClick={() => toggleMenu('user-management')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200 ${!sidebarOpen && 'justify-center'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <Users className="w-5 h-5 text-blue-400" />
                                {sidebarOpen && <span className="font-medium">Quản lý người dùng</span>}
                            </div>
                            {sidebarOpen && (
                                expandedMenus.includes('user-management') ?
                                    <ChevronDown className="w-4 h-4" /> :
                                    <ChevronRight className="w-4 h-4" />
                            )}
                        </button>

                        {sidebarOpen && expandedMenus.includes('user-management') && (
                            <ul className="mt-2 ml-6 space-y-1">
                                <li>
                                    <button
                                       onClick={() => setActiveTab("users")}
                                        className="w-full text-left p-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700/30 transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <Users className="w-4 h-4" />
                                        <span>Xem danh sách</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleCreate}
                                        className="w-full text-left p-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700/30 transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Tạo tài khoản mới</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleGoToUser}
                                        className="w-full text-left p-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700/30 transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Về trang người dùng</span>
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Quản lý đơn hàng */}
                    <div>
                        <button
                            onClick={() => toggleMenu('order-management')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200 ${!sidebarOpen && 'justify-center'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <ShoppingCart className="w-5 h-5 text-green-400" />
                                {sidebarOpen && <span className="font-medium">Quản lý đơn hàng</span>}
                            </div>
                            {sidebarOpen && (
                                expandedMenus.includes('order-management') ?
                                    <ChevronDown className="w-4 h-4" /> :
                                    <ChevronRight className="w-4 h-4" />
                            )}
                        </button>

                        {sidebarOpen && expandedMenus.includes('order-management') && (
                            <ul className="mt-2 ml-6 space-y-1">
                                <li>
                                    <button
                                    onClick={() => setActiveTab("orders")}
// Nút để kích hoạt hiển thị và fetch order
                                        className="w-full text-left p-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700/30 transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span>Xem danh sách đơn hàng</span>
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Quản lý sản phẩm */}
                    <div>
                        <button
                            onClick={() => toggleMenu('product-management')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200 ${!sidebarOpen && 'justify-center'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <Package className="w-5 h-5 text-purple-400" />
                                {sidebarOpen && <span className="font-medium">Quản lý sản phẩm</span>}
                            </div>
                            {sidebarOpen && (
                                expandedMenus.includes('product-management') ?
                                    <ChevronDown className="w-4 h-4" /> :
                                    <ChevronRight className="w-4 h-4" />
                            )}
                        </button>

                        {sidebarOpen && expandedMenus.includes('product-management') && (
                            <ul className="mt-2 ml-6 space-y-1">
                                <li className="p-2 text-sm text-gray-500">
                                    <button
                                     onClick={() => setActiveTab("products")}
// Nút để kích hoạt hiển thị và fetch order
                                        className="w-full   text-left p-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700/30 transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        <span>Xem danh sách sản phẩm</span>
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        onClick={logout}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-all duration-200 ${!sidebarOpen && 'justify-center'}`}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-auto">
                {/* Header */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Chào mừng Admin, <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">{user.username}</span>!
                            </h1>
                            <p className="text-gray-400 text-lg">Đây là trang Dashboard quản trị.</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Settings className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* User Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <p className="text-gray-400 text-sm mb-1">Email</p>
                            <p className="text-white font-semibold">{user.email || 'N/A'}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <p className="text-gray-400 text-sm mb-1">Số điện thoại</p>
                            <p className="text-white font-semibold">{user.phone || 'N/A'}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <p className="text-gray-400 text-sm mb-1">Vai trò</p>
                            <p className="text-white font-semibold">{user.roles?.map(role => role.name).join(', ')}</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-4">
                    {activeTab === "products" && <AdminProductTable accessToken = {accessToken} />}
                    {activeTab === "orders" && <div> <AdminOrderTable accessToken={accessToken } /></div>}
                    {activeTab === "users" && <div><AdminUserTable accessToken={ accessToken} /></div>}
                </div>

                {/* Users Table */}
                
                {/* Orders Table - Chỉ hiển thị khi shouldFetchOrders là true */}
                

                 
            </div>
            

            <CreateUserModal
    isOpen={isCreateModalOpen} // Truyền state điều khiển
    onClose={handleCloseCreateModal} // Truyền hàm đóng modal
    onUserCreated={handleFetchAllUser} // Callback khi tạo thành công để refresh danh sách
/>

       
                   <EditProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
                onUpdateSuccess={() => {
            alert("Cập nhât sản phẩm thành công")
            setShouldFetchProduct(false)
        }}
      />
        </div>
    );
};

export default AdminDashboardPage;

import React, { useState, useEffect } from 'react';
import api from '../axios/axios'; // Đã điều chỉnh đường dẫn import cho axios
import { useNavigate } from 'react-router-dom';

// Interface cho form chỉnh sửa người dùng
interface EditForm {
  id: number;
  username: string;
  email: string;
  phone: string;
  roles: string[]; // Đa vai trò
  status: string; // Thêm trạng thái
}

// Props cho EditUserModal
interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: EditForm | null; // Dữ liệu người dùng để chỉnh sửa
  onUserUpdated: () => void; // Callback khi người dùng được cập nhật thành công
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, userData, onUserUpdated }) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_Token');

  // State cục bộ cho form, khởi tạo từ userData hoặc giá trị mặc định
  const [formData, setFormData] = useState<EditForm>({
    id: 0,
    username: '',
    email: '',
    phone: '',
    roles: [],
    status: '',
  });

  // Cập nhật formData mỗi khi userData thay đổi (khi modal được mở với user mới)
  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        // Chuyển đổi roles từ { name: string }[] sang string[] nếu cần
        roles: userData.roles || [], 
        status: userData.status || 'active', // Đảm bảo có giá trị mặc định
      });
    }
  }, [userData]);

  // Nếu modal không mở thì không render gì cả
  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRolesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      roles: selectedOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
      console.error("Không có ID người dùng để cập nhật.");
      // Bạn có thể hiển thị thông báo lỗi cho người dùng ở đây
      return;
    }

    try {
      // Đã sửa: Sử dụng api.put để cập nhật người dùng theo ID
      await api.put(`api/v1/user/update/${formData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert('Cập nhật người dùng thành công!');
      onUserUpdated(); // Gọi callback để refresh danh sách người dùng trong AdminDashboardPage
      onClose(); // Đóng modal
    } catch (error: any) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      alert(error.response?.data?.message || 'Lỗi khi cập nhật người dùng!');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 transition-opacity flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <form onSubmit={handleSubmit} className="w-full mx-auto flex flex-col gap-4">
            <h2 className="text-xl font-bold text-blue-600 text-center mb-4">Chỉnh sửa người dùng</h2>
            
            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <label className="block text-sm font-medium text-gray-700">Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700">Trạng thái:</label>
            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">Vai trò (Ctrl để chọn nhiều):</label>
            <select
              multiple
              name="roles"
              value={formData.roles}
              onChange={handleRolesChange}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;

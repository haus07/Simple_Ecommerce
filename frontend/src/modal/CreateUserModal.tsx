import React, { useState, useEffect } from 'react';
import api from '../axios/axios'; // Đảm bảo đường dẫn import cho axios là chính xác
import { useNavigate } from 'react-router-dom';

// Interface cho form tạo người dùng mới
interface CreateForm {
  username: string;
  password: string; // Thêm trường password cho tạo mới
  email: string;
  phone: string;
  roles: string[]; // Đa vai trò
}

// Props cho CreateUserModal
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void; // Callback khi người dùng được tạo thành công
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_Token');

  // State cục bộ cho form, khởi tạo các trường rỗng
  const [formData, setFormData] = useState<CreateForm>({
    username: '',
    password: '', // Trường password rỗng
    email: '',
    phone: '',
    roles: [],
  });

  // Reset form data khi modal được mở/đóng hoặc khi người dùng được tạo thành công
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        username: '',
        password: '',
        email: '',
        phone: '',
        roles: [],
      });
    }
  }, [isOpen]);

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

    try {
      // Đã sửa: Sử dụng api.post để tạo người dùng mới
      await api.post('api/v1/users', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert('Tạo người dùng thành công!');
      onUserCreated(); // Gọi callback để refresh danh sách người dùng
      onClose(); // Đóng modal
    } catch (error: any) {
      console.error("Lỗi khi tạo người dùng:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      alert(error.response?.data?.message || 'Lỗi khi tạo người dùng!');
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
            <h2 className="text-xl font-bold text-blue-600 text-center mb-4">Tạo người dùng mới</h2>
            
            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <label className="block text-sm font-medium text-gray-700">Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
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
                Tạo người dùng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;

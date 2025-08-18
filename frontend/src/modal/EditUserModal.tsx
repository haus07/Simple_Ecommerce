import React, { useState, useEffect } from 'react';
import api from '../axios/axios'; // Đảm bảo tệp này tồn tại và xuất mặc định (export default)
import { useNavigate } from 'react-router-dom';
import { useUpdateUser } from '../hooks/user/useUser';

// Interface cho form chỉnh sửa người dùng
interface EditForm {
  id: number;
  username: string;
  email: string;
  phone: string;
  // Bỏ roles và status để phù hợp với EditUserPage
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
  const updateUserMutation = useUpdateUser(accessToken)
  
  // State cục bộ cho form, khởi tạo từ userData hoặc giá trị mặc định
  const [formData, setFormData] = useState<EditForm>({
    id: 0,
    username: '',
    email: '',
    phone: '',
  });
  
  // Cập nhật formData mỗi khi userData thay đổi (khi modal được mở với user mới)
  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
      });
    }
  }, [userData]);

  // Nếu modal không mở thì không render gì cả
  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
      console.error("Không có ID người dùng để cập nhật.");
      return;
    }

    try {
      // Đã sửa: Sử dụng api.patch và endpoint user/edit
      updateUserMutation.mutate({ id:formData.id,body:formData})
      alert("Cập nhật người dùng thành công")
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

  // --- Định nghĩa Styles đã được chỉnh sửa để khớp với EditUserPage ---
  const commonStyles: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    color: '#000000', // Sẽ bị ghi đè bởi các thành phần con nếu cần
  };

  const formContainerStyle: React.CSSProperties = {
    ...commonStyles,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    background: '#3a3a3a',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '30px',
  };

  const formStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#b0b0b0',
  };

  const inputStyle: React.CSSProperties = {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #555',
    backgroundColor: '#444',
    color: '#e0e0e0',
    width: '100%',
  };

  const disabledInputStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: '#555', // Màu nền cho input bị disabled
    cursor: 'not-allowed',
    opacity: 0.7,
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    gap: '15px',
  };

  const baseButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    outline: 'none',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    color: 'white',
    flex: 1,
  };

  const saveButtonStyle: React.CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: '#007bff',
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: '#6c757d',
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 transition-opacity flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div style={formContainerStyle}> {/* Đã đổi từ Tailwind sang inline style */}
        <h2 style={titleStyle}>Chỉnh sửa người dùng</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={disabledInputStyle} // Áp dụng style cho disabled
            disabled // Đặt disabled
          />
          
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          
          <label style={labelStyle}>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Bỏ các trường roles và status để khớp với EditUserPage */}
          {/* <label style={labelStyle}>Trạng thái:</label>
          <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
          >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
          </select>

          <label style={labelStyle}>Vai trò (Ctrl để chọn nhiều):</label>
          <select
            multiple
            name="roles"
            value={formData.roles}
            onChange={handleRolesChange}
            style={{ ...inputStyle, height: '112px' }} // Chiều cao cho select multiple
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select> */}

          <div style={buttonGroupStyle}>
            <button
              type="submit"
              style={saveButtonStyle}
            >
              Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={onClose}
              style={cancelButtonStyle}
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;

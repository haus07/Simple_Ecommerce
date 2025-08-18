import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../axios/axios';

interface UserForm {
  username: string;
  email: string;
  phone: string;
}

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserForm>({
    username: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = localStorage.getItem('access_Token');

  // Lấy thông tin người dùng khi component được load
  useEffect(() => {
    const fetchUser = async () => {
      if (!id || !accessToken) {
        navigate('/admin');
        return;
      }
      try {
        const res = await api.get(`api/v1/user/info/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const { username, email, phone } = res.data;
        setFormData({ username, email, phone });
      } catch (err: any) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Không thể tải thông tin người dùng.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, accessToken, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      navigate('/login');
      return;
    }
    try {
      await api.patch(`api/v1/user/edit/${id}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      alert('Cập nhật thành công!');
      navigate('/admin');
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Lỗi khi cập nhật. Vui lòng thử lại.');
      }
    }
  };

  // Hiển thị trạng thái loading hoặc lỗi ở giữa trang
  if (loading) {
    return (
      <div style={pageWrapperStyle}>
        <div style={loadingStyle}>Đang tải...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={pageWrapperStyle}>
        <div style={errorStyle}>
          <p>{error}</p>
          <button onClick={() => navigate('/admin')} style={backButton}>Quay lại</button>
        </div>
      </div>
    );
  }

  // Hiển thị form khi đã tải xong dữ liệu
  return (
    <div style={pageWrapperStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Chỉnh sửa người dùng</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            style={inputStyle}
            disabled
          />
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
          <label style={labelStyle}>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            placeholder="SĐT"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />
          <div style={buttonGroupStyle}>
            <button type="submit" style={buttonStyle}>Lưu thay đổi</button>
            <button type="button" onClick={() => navigate('/admin')} style={cancelButton}>Hủy bỏ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;

// --- Định nghĩa Styles đã được chỉnh sửa ---
const commonStyles: React.CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  color: '#000000',
};

const pageWrapperStyle: React.CSSProperties = {
    ...commonStyles,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
};

const formContainerStyle: React.CSSProperties = {
    ...commonStyles,
    position: 'relative',
    left:'600px',
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

const buttonStyle: React.CSSProperties = {
  ...baseButtonStyle,
  backgroundColor: '#007bff',
  ':hover': {
    backgroundColor: '#0056b3',
    transform: 'translateY(-2px)',
  },
};

const cancelButton: React.CSSProperties = {
  ...baseButtonStyle,
  backgroundColor: '#6c757d',
  ':hover': {
    backgroundColor: '#5a6268',
    transform: 'translateY(-2px)',
  },
};

const loadingStyle: React.CSSProperties = {
  ...commonStyles,
  textAlign: 'center',
  fontSize: '1.5rem',
  marginTop: '50px',
  width: '100%',
};

const errorStyle: React.CSSProperties = {
  ...commonStyles,
  textAlign: 'center',
  fontSize: '1.2rem',
  padding: '40px',
  maxWidth: '500px',
  width: '100%',
  background: '#3a3a3a',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
};

const backButton: React.CSSProperties = {
  ...baseButtonStyle,
  backgroundColor: '#007bff',
  marginTop: '20px',
};

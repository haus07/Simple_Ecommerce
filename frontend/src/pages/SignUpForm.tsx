import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios/axios'; // Đảm bảo file axios đã setup baseURL

// Định nghĩa kiểu dữ liệu cho form
type SignupFormData = {
  username: string;
  password: string;
  email: string;
  phone: string;
};

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    password: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response =  await api.post('api/v1/auth', formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

    return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: 'center', color: '#1a1a1a' }}>Đăng ký</h2>
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
        <p style={loginTextStyle}>
          Bạn đã có tài khoản?{' '}
          <button type="button" onClick={handleLoginRedirect} style={loginButtonStyle}>
            Đăng nhập
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;

// Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  backgroundColor: '#f5f5f5',
};

const formStyle = {
  width: '100%',
  maxWidth: '400px',
  padding: '30px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const inputStyle = {
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  color: '#333',
  transition: 'border-color 0.2s',
};

const buttonStyle = {
  padding: '14px',
  backgroundColor: '#1a1a1a',
  color: 'white',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.2s',
};

const loginButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#666',
  fontWeight: 'bold',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '0',
  margin: '0',
};

const loginTextStyle = {
  textAlign: 'center',
  fontSize: '1rem',
  color: '#666',
  marginTop: '10px',
};
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
        <h2 style={{ textAlign: 'center', color:'blue' }}>Đăng ký</h2>
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
const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width:'100vw',
  backgroundColor: '#3a3a3a',
};

const formStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '400px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '10px',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ddd',
  borderRadius: '5px',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: '#007bff',
  color: 'white',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const loginButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#5267ff',
  fontWeight: 'bold',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: '0.9rem',
  padding: '0',
  margin: '0',
};

const loginTextStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '0.9rem',
  color: '#666',
  marginTop: '10px',
};
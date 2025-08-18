// src/pages/UserDashboardPage.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();




  if (!user) {
    return <div>Đang tải thông tin người dùng...</div>; // Should ideally not happen due to PrivateRoute
  }

  return (
    <div style={dashboardPageStyle}>
      <h1>Chào mừng, {user.username}!</h1>
      <p>Đây là trang Dashboard của người dùng thường.</p>
          <p>Email: {user.email || 'N/A'}</p>
          <p>SDT:{ user.phone}</p>
      <p>Vai trò của bạn: {user.roles.map(role=>role.name)}</p>
      
      {/* Nút đăng xuất */}
      <button onClick={logout} style={buttonStyle}>Đăng xuất</button>

      {/* Admin có thể có nút quay về trang Admin nếu muốn */}
      
    </div>
  );
};

export default UserDashboardPage;

const dashboardPageStyle: React.CSSProperties = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  maxWidth: '800px',
  margin: '20px auto',
  backgroundColor: '#000000',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  lineHeight: '1.6',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 15px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  outline: 'none',
  transition: 'background-color 0.3s ease',
  marginTop: '20px', // Thêm khoảng cách phía trên nút
};
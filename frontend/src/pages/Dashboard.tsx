import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../axios/axios'; 

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isAdmin,setIsAdmin] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('access_Token');
    navigate('/login');
  };

  const fetchUserInfo = async () => {
    const accessToken = localStorage.getItem('access_Token')

    if (!accessToken) {
      
      console.warn('Khong tim thay token')
      return null
    }

    try {
      const response = await api.get('user/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      setUserInfo(response.data.userWithoutPassword)
      console.log(response.data)

      const isAdmin = userInfo.roles.includes('admin') 
      setIsAdmin(isAdmin)
      
    } catch (error:any) {
      if (error.response?.status === 401) {
      localStorage.removeItem('access_Token');
      alert('Token hết hạn. Vui lòng đăng nhập lại.');
      navigate('/login');
    } else {
      console.error('Lỗi khi lấy thông tin người dùng:', error.message);
    }
    }
  };

  return (
    <div style={containerStyle}>
      <h1>Xin chào!</h1>
      <button onClick={handleLogout} style={buttonStyle}>Đăng xuất</button>
      <button onClick={fetchUserInfo} style={{ ...buttonStyle, marginLeft: 10 }}>Lấy thông tin người dùng</button>

      {userInfo && (
        <>
          <h2>Thông tin người dùng:</h2>
          <ul>
            <li >
                {userInfo.username}
            </li>
            <li >
                {userInfo.email}  
            </li>
            <li >
                {userInfo.phone}  
            </li>
          </ul>
        </>
      )}

    </div>
  );
};

export default Dashboard;

const containerStyle: React.CSSProperties = {
  padding: '20px',
  fontFamily: 'Arial',
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: '14px',
  cursor: 'pointer',
};

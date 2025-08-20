import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import SignUpForm from './pages/SignUpForm';
import LoginForm from './pages/LoginForm';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import EditUserPage from './pages/EditUserPage';
import CreatePage from './pages/CreatePage';
import MainContent from './components/MainContent';
import ProductPage from './pages/ProductPage';
import SidebarLayout from './layouts/SidebarLayout';
import ShoppingCart from './pages/ShoppingCart';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetail from './pages/OrderDetail';
import UserProfilePage from './pages/UserProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Route bảo vệ
const PrivateRoute = ({ children, adminOnly = false, allowRoles = [] }) => {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();

  if (isLoading) return <div>Đang tải xác thực...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/main" replace />;

  const roles = user?.roles?.map((r) => r.name) || [];
  const hasAccess = allowRoles.length === 0 || allowRoles.some((role) => roles.includes(role));
  if (!hasAccess) {
    localStorage.removeItem('access_Token');
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route `/` tự redirect theo role
const HomeRedirect = () => {
  return <Navigate to="/main" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          
        <Routes>
          <Route path="/" element={<HomeRedirect/>} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Dashboard */}
          <Route path="/user" element={<PrivateRoute allowRoles={['user']}><UserDashboardPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly allowRoles={['admin']}><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/admin/edit/:id" element={<PrivateRoute adminOnly allowRoles={['admin']}><EditUserPage /></PrivateRoute>} />
          <Route path="/admin/create" element={<PrivateRoute adminOnly allowRoles={['admin']}><CreatePage /></PrivateRoute>} />
          <Route path='/user/profile' element={ <PrivateRoute allowRoles={['user']}><UserProfilePage/></PrivateRoute>} />
          {/* Route có sidebar */}
          <Route path='/checkout/done' element={ <PrivateRoute><OrderDetail/></PrivateRoute>} />
          <Route path='/checkout/:orderId' element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        <Route element={<SidebarLayout />}>
            <Route path='/cart' element={ <PrivateRoute allowRoles={['user']}><ShoppingCart/></PrivateRoute>} />
            <Route path="/main" element={<MainContent />} />
            <Route path="/product/:id" element={<ProductPage />} />
        </Route>
          {/* Fallback */}
          <Route path="*" element={<NotFoundPage/>} />
        </Routes>
          
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

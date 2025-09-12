import React, { useEffect, useState } from 'react';
import api from '../axios/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from "react-icons/fa"

type LoginFormData = {
  username: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login , setUser} = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('api/v1/auth/login', formData);
      const accessToken = response.data.accessToken;

      const userData = await login(accessToken);
      const hasAdminRole = userData?.roles?.map(role=>role.name).includes('admin')

      if (hasAdminRole) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/main', { replace: true });
      }

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup')
  }

  const handleOauthGoogle =  () => {
    window.location.href =  'http://localhost:3000/api/v1/auth/google/login'
  }

  useEffect(() => {
    const verifyLogin = async () => {
      const accessToken = localStorage.getItem('access_Token');
     
      const header = accessToken ? {Authorization: `Bearer ${accessToken}`} : {}
      try {
          console.log(header)
          const response = await api.get('api/v1/users/me', {
            headers: header,
            withCredentials:true
          });
          console.log(response.data)
          
          const userData = response.data.userWithoutPassword
          console.log(userData)
          setUser(userData)
        
          const hasAdminRole = userData?.roles?.map(role=>role.name).includes('admin')

          if (hasAdminRole) {
            navigate('/admin', { replace: true });
          } else {
            navigate('/main', { replace: true });
        }
        } catch (error) {
          if (error.response?.status === 401) {
          localStorage.removeItem('access_Token');
            navigate('/login')
          }          
      } 
      
    };
    verifyLogin();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main form container */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Đăng nhập
            </h2>
            <p className="text-gray-600 text-sm">Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>
               <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                              <div onClick={()=>handleOauthGoogle()} className="
                            w-10
                            h-10
                            bg-gray-300
                            rounded-full
                            flex
                            items-center
                            justify-center
                            cursor-pointer
                            hover:opacity-80
                            transition">
                            <FcGoogle size={30} />
                            </div>
                            <div className="
                            w-10
                            h-10
                            bg-gray-300
                            rounded-full
                            flex
                            items-center
                            justify-center
                            cursor-pointer
                            hover:opacity-80
                            transition">
                            <FaGithub size={30} />
                            </div>
                      </div>
          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Bạn chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={handleSignUpRedirect}
                className="text-black font-medium hover:underline transition-all"
              >
                Đăng ký
              </button>
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            Được bảo mật bởi mã hóa end-to-end 🔒
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
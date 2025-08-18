import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  Zap, 
  AlertTriangle,
  RefreshCw,
  Compass,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Mock navigation function
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/main');
  };

  const goBack = () => {
    window.history.back();
  };

  const handleSearch = () => {
    navigate('/search');
  };

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`
        }}
      ></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Star className="w-2 h-2 text-white" />
          </div>
        ))}
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        ></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* 404 Number with Glitch Effect */}
        <div className="relative mb-8">
          <h1 
            className="text-[12rem] md:text-[16rem] font-black text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text leading-none select-none"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              textShadow: isHovering ? '0 0 30px rgba(147, 51, 234, 0.5)' : 'none',
              transform: isHovering ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            404
          </h1>
          
          {/* Glitch overlay effect */}
          <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-red-500 opacity-0 animate-pulse leading-none pointer-events-none">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            Oops! Trang không tồn tại
          </h2>
          
          <p className="text-xl text-gray-300 mb-2">
            Trang bạn đang tìm kiếm đã biến mất trong không gian mạng
          </p>
          
          <p className="text-gray-400">
            Có thể nó đã bị di chuyển, xóa hoặc bạn đã nhập sai địa chỉ URL
          </p>
        </div>

        {/* Interactive Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Go Home Button */}
          <button
            onClick={goHome}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3"
          >
            <Home className="w-5 h-5 group-hover:animate-pulse" />
            <span>Về trang chủ</span>
          </button>

          {/* Go Back Button */}
          <button
            onClick={goBack}
            className="group bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3"
          >
            <ArrowLeft className="w-5 h-5 group-hover:animate-bounce group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </button>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="group bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3"
          >
            <Search className="w-5 h-5 group-hover:animate-spin" />
            <span>Tìm kiếm</span>
          </button>
        </div>

        {/* Fun Interactive Elements */}
        <div className="flex justify-center space-x-8 mb-8">
          {/* Spinning Icon */}
          <div className="group cursor-pointer">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group-hover:rotate-180">
              <RefreshCw className="w-8 h-8 text-purple-400 group-hover:animate-spin" />
            </div>
            <p className="text-sm text-gray-400 mt-2">Làm mới</p>
          </div>

          {/* Compass */}
          <div className="group cursor-pointer">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
              <Compass className="w-8 h-8 text-blue-400 group-hover:animate-bounce" />
            </div>
            <p className="text-sm text-gray-400 mt-2">Khám phá</p>
          </div>

          {/* Lightning */}
          <div className="group cursor-pointer">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300">
              <Zap className="w-8 h-8 text-yellow-400 group-hover:animate-pulse" />
            </div>
            <p className="text-sm text-gray-400 mt-2">Nhanh chóng</p>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Có thể bạn đang tìm:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
              Sản phẩm hot
            </a>
            <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
              Khuyến mãi
            </a>
            <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
              Liên hệ
            </a>
            <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
              Trợ giúp
            </a>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-8">
          <p className="text-gray-500 text-sm">
            Lỗi 404 - Không tìm thấy trang • 
            <span className="text-purple-400"> Hãy thử lại sau nhé! </span>
            🚀
          </p>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={goHome}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center group hover:scale-110 transition-all duration-300"
      >
        <Home className="w-6 h-6 text-white group-hover:animate-bounce" />
      </button>
    </div>
  );
};

export default NotFoundPage;
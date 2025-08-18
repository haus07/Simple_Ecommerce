import { ShoppingCart, User, Search, Menu, Heart, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../axios/axios';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { countCartItems } from '../app/middleware/apiMiddleware';
import { useFilter } from '../context/FilterContext';

export default function Navbar() {
  const { searchQuery,setSearchQuery} = useFilter()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(); // Example cart count
    const navigate = useNavigate()
  const { user, logout } = useAuth()
  const dispatch = useDispatch()
  const count = useSelector((state: RootState) => state.cart.count)
  const [inputValue, setInputValue] = useState("")
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 500)
    return () => {
      clearTimeout(handler)
    }
  },[inputValue,setSearchQuery])
  
  
  console.log(count)
  
    useEffect(() => {
      const getCount = async () => {
          
        dispatch(countCartItems())
      }
        getCount()
      },[dispatch,navigate])
  
    
  return (
    <nav className=" bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left group: Logo + menu */}
          <div className="flex items-center space-x-8 relative right-36 ">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                haus
              </h1>
            </div>  

            {/* Desktop Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Categories
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Deals
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  About
                </a>
              </div>
            </div>
          </div>

          {/* Right group: search + wishlist + cart + login */}
          <div className="flex items-center space-x-4 relative left-36">

            {/* Search Bar (Desktop) */}
            <div className="hidden md:block w-64 relative ">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Wishlist */}
            {user && (
              <button onClick={() => {
              if (!user) {
                navigate('/login')
              }
              else {
                navigate(`/user/profile`)
              }
            }} className="hidden md:block p-2 text-gray-700 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors">
              <User className="h-6 w-6" />
            </button>
            )}

            {/* Cart Icon */}
                      <button onClick={() => {
                          if (!user) {
                              navigate('/login')
                          } else {
                              navigate('/cart')
                          }
            }} className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {count > 0 && user && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {count}
                </span>
              )}
            </button>

            {/* Login */}
                      {user ? <button onClick={logout} className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg  transition-colors font-medium">
                          <User className="h-4 w-4" />
                          <span>LogOut</span>
                      </button>
                          : (<button onClick={() => {
                          navigate('/login')
                      }} className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg transition-colors font-medium">
                          <User className="h-4 w-4" />
                          <span>Login</span>
                      </button>)}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

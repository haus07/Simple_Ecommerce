import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Minus, X, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../axios/axios';
import { useParams } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { setItems } from '../features/order/orderSlice';
import type { RootState } from '@reduxjs/toolkit/query';

export default function CheckoutPage() {
  console.log('Conpoasdasd')
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "Smart Watch Series 7",
      price: 299.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 3,
      name: "USB-C Charging Cable",
      price: 19.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center"
    }
  ]);

  const navigate = useNavigate()
  const { orderId } = useParams<{ (orderId: string) }>();

  const handleVnPay = async () => {
    const response = await api.get('api/v1/payment/create', {
      params: {
        orderCode:orderCode,
        amount:total*1000
      }
    })
    localStorage.setItem('orderId',orderId)
    window.location.href = response.data.paymentUrl
  } 
  
  const [orderCode,setOrdercode] = useState(null)
  
  
  // Thêm một bước kiểm tra để đảm bảo orderId tồn tại trước khi chuyển đổi
  const dispatch = useDispatch()
  const orderItems = useSelector((state:RootState)=>state.order)
  
  console.log(orderItems)
  useEffect(() => {
    console.log('useEffect has been triggered. orderId:', orderId);
    
    // ✅ Thêm điều kiện kiểm tra orderId hợp lệ
    if (orderId) {
      console.log("Order ID is valid, starting API call...");
      const getOrderData = async () => {
        console.log("hamasdjashj@@NJN@JH");
        try {
          const accessToken = localStorage.getItem('access_Token');
          if (!accessToken) {
            navigate('/login');
            return;
          }
          const response = await api.get(`api/v1/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          console.log("Dispatching items:", response.data.items);
          dispatch(setItems(response.data));
          setOrdercode(response.data.orderCode)
          console.log(orderCode)
        } catch (error) {
          if (error.response?.status === 401) {
            navigate('/login');
            return;
          }
          console.error("Error fetching order data:", error);
        }
      };
      
      getOrderData();
    } else {
        console.log("Order ID is not available, skipping API call.");
    }
  }, [orderId, navigate, dispatch]);
  const [shippingMethod, setShippingMethod] = useState('standard');
  console.log(orderItems)
  
   

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = orderItems.items.reduce((sum, item) => {
    const price = parseFloat(item.product.price) || 0;
    return sum + price * item.quantity;
  }, 0);
  const shippingCost = shippingMethod === 'express' ? 15.99 : shippingMethod === 'overnight' ? 25.99 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal ;
  console.log(orderId)
  const handleDoneCheckout = async () => {
    try {
      const accesToken = localStorage.getItem('access_Token')
      if (!accesToken) {
        navigate('/login')
      }
      const response = await api.patch(`api/v1/orders/${orderId}`, {
        status:'wait for paid',
      }, {
        headers: { Authorization: `Bearer ${accesToken}` }
      })
      if (response.data.success === true) {
        const newOrderId = response.data.order.id
        navigate(`/checkout/done/${newOrderId}`)
        dispatch(setItems(response.data.order))
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  const handleCancelOrder = async () => {
    try {
      const accesToken = localStorage.getItem('access_Token')
      if (!accesToken) {
        navigate('/login')
      }
      const response = await api.patch(`api/v1/orders/${orderId}`, {
        status:'canceled',
      }, {
        headers: { Authorization: `Bearer ${accesToken}` }
      })
      if (response.data.success === true) {
        const newOrderId = response.data.order.id
        navigate(`/checkout/done/${newOrderId}`)
        dispatch(setItems(response.data.order))
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Review your order and select shipping</p>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-black" />
              Order Summary
            </h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {orderItems.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <img 
                    src={item.product.thumbnail} 
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                    <p className="text-gray-600">${Number(item.product.price).toFixed(2)} </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                     
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(Number(item.product.price )*item.quantity).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({orderItems.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
             
             
              <div className="flex justify-between border-t pt-3 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Method */}
    

          {/* Continue Button */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button onClick={handleDoneCheckout} className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-white hover:text-black hover:border-black border border-transparent transition-colors">
              COD Payment
            </button>
             <button onClick={handleVnPay} className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg mt-9 hover:bg-white hover:text-black hover:border-black border border-transparent transition-colors">
              VnPay Payment
            </button>
              <button onClick={handleCancelOrder} className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg mt-9 hover:bg-white hover:text-black hover:border-black border border-transparent transition-colors">
              Cancel Order
            </button>
            <p className="text-center text-gray-500 text-sm mt-3">
              You can review everything before final payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
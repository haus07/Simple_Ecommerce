import React, { useEffect } from 'react';
import { CheckCircle, Package, Calendar, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../axios/axios';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import dayjs from 'dayjs';
import { updateOrderStatus } from '../features/order/orderSlice';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderDetailProps {
  orderNumber?: string;
  orderDate?: string;
  status?: string;
  items?: OrderItem[];
  totalAmount?: number;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  orderNumber = "ORD-2024-001234",
  orderDate = "August 11, 2025",
  status = "Confirmed",
  totalAmount = 159.97,
  items = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      quantity: 1,
      price: 79.99
    },
    {
      id: "2", 
      name: "USB-C Charging Cable",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
      quantity: 2,
      price: 19.99
    },
    {
      id: "3",
      name: "Phone Case - Clear",
      image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=300&h=300&fit=crop",
      quantity: 1,
      price: 39.99
    }
  ]
}) => {
    const dispatch = useDispatch()
    const orderItems = useSelector((state:RootState)=>state.order)
    const { orderId} = useParams()
    const navigate = useNavigate()
   useEffect(() => {
     const params = Object.fromEntries(new URLSearchParams(window.location.search));
     console.log('hahahahahahahahahaha')

  if (params.vnp_TxnRef) {
    api.get('api/v1/payment/verify', { params })
      .then(res => {
        // cập nhật redux store
        dispatch(updateOrderStatus({ orderId: localStorage.getItem('orderId'), status: res.data.status }));
      })
      .catch(err => console.error(err));
  }
}, []);

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
          case 'succeeded':
              return 'bg-green-100 text-green-800 border-green-200';
              case 'processing':
                  return 'bg-blue-100 text-blue-800 border-blue-200';
                  case 'shipped':
                      return 'bg-purple-100 text-purple-800 border-purple-200';
                      case 'wait for paid':
                          return 'bg-amber-100 text-amber-800 border-amber-200';
                          default:
                              return 'bg-gray-100 text-gray-800 border-gray-200';
                            }
                        };
    console.log(orderItems)
    console.log(orderItems.status)
                        
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'processing':
        return <Clock className="w-5 h-5" />;
      case 'shipped':
      case 'wait for paid':
        return <Package className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
    };
    console.log(orderItems.status)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
          </div>
          
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Number */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900">{orderItems.orderCode}</p>
                </div>
              </div>
    
              {/* Order Date */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Date</p>
                  <p className="text-lg font-semibold text-gray-900">{dayjs(orderItems.createdAt).format("DD/MM/YYYY HH:mm")}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  {getStatusIcon(orderItems.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(orderItems.status)}`}>
                    { orderItems.status.charAt(0).toUpperCase() + orderItems.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {orderItems.items.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    src={item.product.thumbnail}
                    alt={item.product.title}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {item.product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${Number(item.product.price).toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">${Number(orderItems.totalPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Track Your Order
          </button>
          <button onClick={() => {
            navigate('/main')
          }} className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
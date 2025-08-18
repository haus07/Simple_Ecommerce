import { Minus, Plus, Trash2, Heart, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // cần import cái này
import api from '../axios/axios';
import { useDispatch,useSelector } from 'react-redux';
import type {  RootState } from '../app/store';
import { updateQuantity, setItems, toggleSelected, removeItem, selectedAllItems } from '../features/cart/cartSlice';
import { updateQuantityByCartId } from '../app/middleware/apiMiddleware';
import Navbar from '../components/Navbar';

export default function ShoppingCart() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  
  // Fetch cart items from API or mock
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        // Mock data ví dụ
        const mockResponse = {
          id: 4,
          items: [
            {
              id: 1,
              quantity: 1,
              product: {
                id: 1,
                title: "Apple iPhone 14 Pro",
                brand: "Apple",
                category: "Smartphone",
                description: "Flagship smartphone with A16 Bionic chip, ProMotion display and triple camera system.",
                images: [
                  "https://images.unsplash.com/photo-1661961112952-53d8f8f7c7bb",
                  "https://images.unsplash.com/photo-1661961112951-baa2c93d2d3f"
                ],
                thumbnail: "https://images.unsplash.com/photo-1661961112952-53d8f8f7c7bb",
                rating: 5,
                price: "999"
              }
            },
            {
              id: 2,
              quantity: 2,
              product: {
                id: 2,
                title: "AirPods Pro (2nd Generation)",
                brand: "Apple",
                category: "Audio",
                description: "Active Noise Cancellation and Spatial Audio",
                images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1"],
                thumbnail: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1",
                rating: 4.8,
                price: "249"
              }
            }
          ]
        };
        
        
        // Uncomment nếu muốn call thật
        
        const accessToken = localStorage.getItem('access_Token');
        if (!accessToken) {
          navigate('/login');
          return;
        }
        const response = await api.get('api/v1/carts/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        dispatch(setItems(response.data.items))
        
        
        
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCartItems();
  }, [navigate]);

  const handleUpdateQuantity = (cartItemId:number, change:number) => {
    const item = cartItems.find(item => item.id === cartItemId)
    if (!item) return
    const newQuantity = item.quantity+change
    console.log(item.id)
    dispatch(updateQuantityByCartId({cartItemId:item.id,quantity:newQuantity}))
    
  };
  
  const handleRemoveItem = (id) => {
    const item = cartItems.find(item => item.id === id)
    if (!item) {
      alert("Sản phẩm không tồn tại")
    }
    dispatch(updateQuantityByCartId({cartItemId:id,quantity:0}))
  };
  
  const toggleItemSelection = (id) => {
   dispatch(toggleSelected({productId:id}))
  };
  
  const toggleSelectAll = () => {
    dispatch(selectedAllItems())
  };

  // Tính toán totals chỉ cho items được chọn
  const selectedItems = cartItems.filter(item => item.selected);
  const checkout = selectedItems.map(item => ({
    quantity: item.quantity,
    productId:item.product.id
  }))
  const subtotal = selectedItems.reduce((sum, item) => {
    const price = parseFloat(item.product.price) || 0;
    return sum + price * item.quantity;
  }, 0);
  const shippingFee = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingFee + tax;

  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
  const handleCheckout = async () => {

    try {
      const accessToken = localStorage.getItem('access_Token')
      if (!accessToken) {
        navigate('/login')
      }
      const response = await api.post('api/v1/orders', {
        items:checkout
      }, {
        headers:{Authorization:`Bearer ${accessToken}`}
      })
      if (response.data.success === true) {
        const orderId = response.data.orderId
        navigate(`/checkout/${orderId}`)
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/login')
      }
    }
  }
  console.log(cartItems)

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Navbar/>
    <div className="h-screen  bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b ">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Shopping Cart ({cartItems.length})</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  Select All ({cartItems.length} items)
                </span>
              </label>
            </div>

            {cartItems.length === 0 && (
              <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                <div className="text-gray-400 mb-4">
                  <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🛒</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">Add some items to get started</p>
                <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}

            
            {cartItems.map((item) => (
                    
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={item.selected || false}
                    onChange={() => toggleItemSelection(item.id)}
                    className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500 mt-2"
                  />
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product?.thumbnail}
                      alt={item.product?.title}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {item.product?.title}
                    </h3>
                    <div className="text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <ShieldCheck className="h-3 w-3 text-green-500" />
                        <span>{item.seller || 'Unknown Seller'}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-green-600">{item.product?.brand}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-orange-500">
                          ${Number(item.product?.price).toFixed(2)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-3 flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 text-sm min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({selectedItems.length} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className={`font-medium ${shippingFee === 0 ? 'text-green-600' : ''}`}>
                      {shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>

                  <hr className="my-3" />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors mt-6"
                  disabled={selectedItems.length === 0}
                >
                  Checkout ({selectedItems.length})
                </button>

                {/* Free Shipping Banner */}
                {subtotal < 50 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-700 font-medium">🚚 Free Shipping</div>
                    <div className="text-xs text-blue-600">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  </div>
                )}

                {subtotal >= 50 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-700 font-medium">✅ Free Shipping Applied</div>
                    <div className="text-xs text-green-600">You qualify for free shipping!</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      </>
  );
}

import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import api from "../axios/axios"
import { increment, descrement } from "../features/cart/cartSlice";

interface Product{
    id: number
    title: string
    description: string
    price: number
    rating: number
    images: string[]
    thumbnail?: string
}

const ProductPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [product, setProduct] = useState<Product | null>(null)
    const dispatch = useDispatch();
    

    

    useEffect(() => {
        if (id) {
            console.log(id)
            
            api.get<Product>(`api/v1/products/${id}`).then(response => {
                setProduct(response.data)
                console.log("Product:" + product)
            }).catch((error) => {
                console.log('Error fetchching product data')
            })
        }
    }, [id])

     const handleAddToCart = async (e: React.FormEvent, productId: number) => {
    e.preventDefault();
    console.log(typeof productId);
    try {
      const accessToken = localStorage.getItem('access_Token');
      const response = await api.post('api/v1/carts/items', {
        productId: productId
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
        dispatch(increment({ quantity:1,productId}));
      alert(response.data.message);
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate('/login');
      }
    }
  };
    
    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <h1 className="text-2xl font-light text-black">Loading...</h1>
            </div>
        )
    }

    

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto p-8">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-8 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors duration-200 border-none cursor-pointer"
                >
                    ← Back
                </button>
                
                {/* Product Container */}
                <div className="bg-white border border-gray-200 overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Product Image */}
                        <div className="bg-gray-50 p-8 flex items-center justify-center">
                            <img 
                                src={product.thumbnail} 
                                alt={product.title} 
                                className="w-full h-auto max-w-md object-contain"
                            />
                        </div>
                        
                        {/* Product Details */}
                        <div className="p-8 flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-black mb-6 leading-tight">
                                    {product.title}
                                </h1>
                                
                                <p className="text-gray-600 mb-8 leading-relaxed text-base">
                                    {product.description}
                                </p>
                                
                                {/* Price and Rating */}
                                <div className="flex items-center gap-8 mb-8">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 uppercase tracking-wide">Price</span>
                                        <span className="text-2xl font-light text-black">${product.price}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 uppercase tracking-wide">Rating</span>
                                        <span className="text-2xl font-light text-black">{product.rating}/5</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Add to Cart Button */}
                            <button 
                                onClick={(e)=>handleAddToCart(e,product.id)}
                                className="w-full py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors duration-200 border-none cursor-pointer text-base"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductPage
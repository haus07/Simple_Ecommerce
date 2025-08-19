import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../axios/axios"

// Mock interfaces for demo purposes
interface Product {
    id: number
    title: string
    description: string
    price: number
    rating: number
    images: string[]
    thumbnail?: string
}

interface Product {
    id: number
    title: string
    description: string
    price: number
    rating: number
    images: string[]
    thumbnail?: string
}

const ProductPage = () => {
    // Mock data for demo - replace with your actual implementation
    const [product, setProduct] = useState<Product | null>({
        id: 1,
        title: "Premium Wireless Headphones",
        description: "Experience exceptional sound quality with these premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium materials for ultimate comfort during extended listening sessions.",
        price: 299.99,
        rating: 4.5,
        images: [],
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
    })
    const [loading, setLoading] = useState(false)
    const [imageError, setImageError] = useState(false)

    // Mock functions - replace with your actual implementations
    const navigate = (path: string | number) => console.log('Navigate to:', path)
    const dispatch = (action: any) => console.log('Dispatch:', action)
    const { id } = useParams<{ id: string }>()

    // Your original useEffect logic would go here
    useEffect(() => {
        if (id) {
            console.log(id)
            setLoading(true)
            
            api.get<Product>(`api/v1/products/${id}`)
                .then(response => {
                    setProduct(response.data)
                    console.log("Product:" + response.data)
                    setLoading(false)
                })
                .catch((error) => {
                    console.log('Error fetching product data')
                    setLoading(false)
                })
        }
    }, [id])

    const handleAddToCart = async (e: React.FormEvent, productId: number) => {
        e.preventDefault()
        console.log('Adding to cart:', productId)
        
        try {
            const accessToken = localStorage.getItem('access_Token')
            const response = await api.post('api/v1/carts/items', {
                productId: productId
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            dispatch(increment({ quantity: 1, productId }))
            alert(response.data.message)
        } catch (error: any) {
            if (error.response?.status === 401) {
                navigate('/login')
            }
        }
        
        // Mock success for demo
        alert('Product added to cart!')
    }
    
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h1 className="text-xl font-light text-gray-600">Loading product...</h1>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-light text-black mb-4">Product not found</h1>
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    const renderStars = (rating: number) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span key={i} className="text-black">★</span>
                )
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-black">☆</span>
                )
            } else {
                stars.push(
                    <span key={i} className="text-gray-300">☆</span>
                )
            }
        }
        return stars
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-8 py-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="group flex items-center gap-3 text-gray-600 hover:text-black transition-colors duration-300"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                        <span className="font-medium">Back to products</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-8 py-12">
                <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-0">
                        {/* Product Image */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                            {!imageError ? (
                                <img 
                                    src={product.thumbnail} 
                                    alt={product.title} 
                                    className="relative z-10 w-full h-auto max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="relative z-10 w-full max-w-lg h-80 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl text-gray-400 mb-2">📦</div>
                                        <p className="text-gray-500">Image not available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Product Details */}
                        <div className="p-12 flex flex-col justify-between">
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-4xl font-light text-black mb-4 leading-tight tracking-wide">
                                        {product.title}
                                    </h1>
                                    
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {product.description}
                                    </p>
                                </div>
                                
                                {/* Price and Rating */}
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">Price</span>
                                        <div className="text-3xl font-light text-black">
                                            ${Number(product.price).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">Rating</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-xl">
                                                {renderStars(product.rating)}
                                            </div>
                                            <span className="text-lg font-light text-gray-600">
                                                {product.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Add to Cart Button */}
                            <div className="pt-8">
                                <button 
                                    onClick={(e) => handleAddToCart(e, product.id)}
                                    className="group w-full py-5 bg-black text-white font-medium hover:bg-gray-900 transition-all duration-300 border-none cursor-pointer text-lg tracking-wide relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        Add to Cart
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                </button>
                                
                                {/* Additional product info */}
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>✓ Free shipping on orders over $50</span>
                                        <span>✓ 30-day return policy</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductPage
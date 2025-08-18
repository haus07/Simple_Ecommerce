import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import api from "../axios/axios"
interface Product{
    id: number
    title: string
    description: string
    price: number
    rating: number
    images:string[]
}

const ProductPage = () => {
    const { id } = useParams <{ (id: string)}>()
    const navigate = useNavigate()
    const [product, setProduct] = useState<Product | null>()
    

    useEffect(() => {
        if (id) {
            console.log(id)
            
            api.get<Product>(`api/v1/products/${id}`).then(response => {
                setProduct(response.data)
                console.log("Product:"+product)
            }).catch((error) => {
                console.log('Error fetchching product data')
            })
        }
    }, [id])
    
    if (!product) {
        return <h1>Loading...</h1>
    }

    return <div className="p-5 w-[60%]">
        <button onClick={() => navigate(-1)} className="mb-5 px-4 py-3 bg-black text-white rounded">Back</button>
        <img src={product.thumbnail} alt={product.title} className="w-[50%] h-auto mb-5" />
        <h1 className="text-2xl mb-4 font-bold">{product.title}</h1>
        <p className="mb-4 text-gray-700 w-[70%]">{product.description}</p>
        <div className="flex">
            <p>Price:${product.price}</p>
            <p className="ml-10">Rating:{ product.rating}</p>
        </div>
    </div>
}

export default ProductPage
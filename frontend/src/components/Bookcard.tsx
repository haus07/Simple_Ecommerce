import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import api from "../axios/axios";
import { useDispatch, useSelector } from "react-redux";
import { increment, descrement } from "../features/cart/cartSlice";
import type { RootState } from "../app/store";

interface BookCardProbs {
  id: string;
  title: string;
  image: string;
  price: number;
}

const BookCard: React.FC<BookCardProbs> = ({ id, title, image, price }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      dispatch(increment(1));
      alert(response.data.message);
    } catch (error: any) {
      if (error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-black transition-all duration-300 flex flex-col justify-between group">
      <Link to={`/products/${id}`} className="block">
        <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-50">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <h2 className="font-semibold text-gray-800 text-base line-clamp-2 mb-2  transition-colors">
          {title}
        </h2>
        
        <p className="text-2xl font-bold text-gray-900 mb-4">
          ${price}
        </p>
      </Link>

      <button
        onClick={(e) => handleAddToCart(e, parseInt(id))}
        className="w-full flex items-center justify-center gap-2 bg-black hover:bg-white hover:text-black text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        <ShoppingCart className="h-5 w-5" />
        Add to Cart
      </button>
    </div>
  );
};

export default BookCard;
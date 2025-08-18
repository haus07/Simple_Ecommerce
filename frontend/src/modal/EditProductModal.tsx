// src/components/EditProductModal.tsx
import React, { useState, useEffect } from 'react';
import { BsX } from 'react-icons/bs';
import api from '../axios/axios'; // Đảm bảo đường dẫn này đúng
import { useNavigate } from 'react-router-dom';
import { useUpdateProduct } from '../hooks/product/useProduct';

// Định nghĩa kiểu dữ liệu cho Product và UpdateProduct để đảm bảo an toàn kiểu (type safety)
interface Product {
    id: number;
    title: string;
    brand: string;
    category: string;
    description: string;
    rating: number;
    price: number;
}

interface UpdateProduct {
    title: string;
    brand: string;
    category: string;
    description: string;
    rating: number;
    price: number;
}

// Định nghĩa props cho component modal
interface EditProductModalProps {
    product: Product; // Sản phẩm cần chỉnh sửa
    isOpen: boolean; // Trạng thái đóng/mở modal
    onClose: () => void; // Hàm để đóng modal
    onUpdateSuccess: () => void; // Hàm được gọi khi cập nhật thành công
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose, onUpdateSuccess }) => {
    // ✅ DI CHUYỂN HOOKS LÊN ĐẦU COMPONENT
    const navigate = useNavigate(); // Hook này phải được gọi đầu tiên
  const accessToken = localStorage.getItem('access_Token');

    const updateProductMutation = useUpdateProduct(accessToken)
    console.log(product)

    // State để lưu trữ dữ liệu form
    const [formData, setFormData] = useState<UpdateProduct|null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sử dụng useEffect để điền dữ liệu sản phẩm hiện tại vào form khi modal mở
    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title,
                brand: product.brand,
                category: product.category,
                description: product.description,
                rating: product.rating,
                price: product.price,
            });
        }
    }, [product]);

    // Nếu modal không mở, không render gì cả (đặt sau khi khai báo hooks)
    if (!isOpen) {
        return null;
    }

    // Hàm xử lý khi giá trị input thay đổi
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  let parsedValue: string | number = value;
  
  if (name === 'rating') {
    parsedValue = value === '' ? '' : parseInt(value, 10); // ép về số nguyên
} else if (name === 'price') {
    parsedValue = value === '' ? '' : parseFloat(value);
}

  setFormData(prevData => ({
    ...prevData,
    [name]: parsedValue as any,
  }));
};

    // Hàm xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const accessToken = localStorage.getItem('access_Token');
            if (!accessToken) {
                // Điều hướng đến trang login nếu không có token
                navigate('/login');
                return; // Ngăn không cho code tiếp tục chạy
            }

             const changedData: Partial<UpdateProduct> = {};
        (Object.keys(formData) as (keyof UpdateProduct)[]).forEach((key) => {
            if (formData[key] !== product[key]) {
                changedData[key] = formData[key];
            }
        });

            // ✅ Gửi trực tiếp formData, không bọc trong một object khác
           updateProductMutation.mutate({id:product.id,body:changedData}, {
    onSuccess: () => {
      onUpdateSuccess();
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi.');
    }
  })

            // Axios tự động ném lỗi cho các phản hồi không phải 2xx,
            // nên bạn chỉ cần kiểm tra xem có dữ liệu trả về không hoặc trạng thái thành công cụ thể nếu cần.
            

        } catch (err: any) {
            // Lỗi từ axios sẽ nằm trong err.response nếu là lỗi HTTP
            setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi không xác định.');
            console.error("Lỗi cập nhật sản phẩm:", err); // Log lỗi để debug
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-8 w-full max-w-lg bg-white rounded-lg shadow-xl">
                <div className="flex justify-between items-center pb-3 border-b-2 border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <BsX className="w-8 h-8" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">
                            Tên sản phẩm
                        </label>
                        <input
                            type="text"
                            id="title" // Đã sửa từ 'name' sang 'title'
                            name="title" // Đã sửa từ 'name' sang 'title'
                            value={formData?.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="brand" className="block text-gray-700 text-sm font-semibold mb-2">
                            Thương hiệu
                        </label>
                        <input
                            type="text"
                            id="brand"
                            name="brand"
                            value={formData?.brand}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 text-sm font-semibold mb-2">
                            Danh mục
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData?.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="price" className="block text-gray-700 text-sm font-semibold mb-2">
                            Giá
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData?.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="rating" className="block text-gray-700 text-sm font-semibold mb-2">
                            Đánh giá
                        </label>
                        <input
                            type="number"
                            id="rating"
                            name="rating"
                            value={formData?.rating}
                            onChange={handleChange}
                            min={1}
                            max={5}
                            step={1}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">
                            Mô tả
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData?.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;

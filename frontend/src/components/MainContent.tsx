import { Tally3, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useFilter } from "../context/FilterContext"
import axios from "axios"
import BookCard from "./Bookcard"
import api from "../axios/axios"
import { useProduct } from "../hooks/product/useProduct"

const MainContent = () => {
    const { searchQuery, selectedCategory, minPrice, maxPrice, keyword, orderBy, sortOrder } = useFilter()
    const [filter, setFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [dropdownOpen, setDropDownOpen] = useState(false)
    const [page, setPage] = useState(1)
    const limit = 8
    const categoryFilter = selectedCategory

    console.log(sortOrder)
    console.log(orderBy)
    
    const { data, loading, isError, error } = useProduct(page, limit, searchQuery, orderBy, sortOrder, categoryFilter,minPrice,maxPrice)
    
    const products = data?.data
    const totalPages = data?.totalPages

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage)
        }
    }
    
    const filteredProducts = products
    
    return (
        <section className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="space-y-8">
                {/* Filter Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative">
                        <button 
                            onClick={() => setDropDownOpen(!dropdownOpen)} 
                            className="group bg-white border-2 border-gray-200 hover:border-blue-300 px-6 py-3 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-200 font-medium text-gray-700 hover:text-blue-600"
                        >
                            <Tally3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                            <span className="text-sm">
                                {filter === 'all' ? 'Filter Products' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </span>
                        </button>
                        
                        {dropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                <div className="py-2">
                                    <button 
                                        className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" 
                                        onClick={() => { setFilter('cheap'); setDropDownOpen(false) }}
                                    >
                                        💰 Cheap
                                    </button>
                                    <button 
                                        className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" 
                                        onClick={() => { setFilter('expensive'); setDropDownOpen(false) }}
                                    >
                                        💎 Expensive
                                    </button>
                                    <button 
                                        className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" 
                                        onClick={() => { setFilter('popular'); setDropDownOpen(false) }}
                                    >
                                        🔥 Popular
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Results Count */}
                    <div className="text-sm text-gray-500">
                        {filteredProducts?.length > 0 && (
                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                {filteredProducts.length} products found
                            </span>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600 font-medium">Something went wrong!</p>
                        <p className="text-red-500 text-sm mt-1">{error?.message}</p>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !isError && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts?.map((product) => (
                            <div key={product.id} className="transform hover:scale-105 transition-transform duration-200">
                                <BookCard 
                                    id={product.id}
                                    title={product.title}
                                    image={product.thumbnail}
                                    price={product.price} 
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !isError && filteredProducts?.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center pt-8 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white hover:bg-black hover:border-white text-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-300 transition-all duration-200"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, index) => {
                                    let pageNumber;
                                    if (totalPages <= 7) {
                                        pageNumber = index + 1;
                                    } else if (page <= 4) {
                                        pageNumber = index + 1;
                                    } else if (page >= totalPages - 3) {
                                        pageNumber = totalPages - 6 + index;
                                    } else {
                                        pageNumber = page - 3 + index;
                                    }

                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all duration-200 font-medium ${
                                                page === pageNumber
                                                    ? "bg-black border-white text-white shadow-lg"
                                                    : "border-gray-300 bg-white hover:bg-black hover:border-white text-black hover:text-white"
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white hover:bg-black hover:border-white text-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-300 transition-all duration-200"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Page Info */}
                {totalPages > 1 && (
                    <div className="text-center text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </div>
                )}
            </div>
        </section>
    )
}

export default MainContent
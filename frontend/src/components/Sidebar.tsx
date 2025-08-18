import { useEffect, useState } from "react"
import { useFilter } from "../context/FilterContext"
import { Search, DollarSign, Filter, RotateCcw } from "lucide-react"

interface Product {
    category: string
}

const Sidebar = () => {
    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        keyword,
        setKeyword,
        orderBy,
        setOrderBy,
        setSortOrder,
        sortOrder
    } = useFilter()
     

    const [inputMinPrice,setInputMinPrice] = useState<number>(undefined)
    const [inputMaxPrice,setInputMaxPrice] = useState<number>(undefined)
    const [page, setPage] = useState(1)
      
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 500)
    return () => {
      clearTimeout(handler)
    }
  },[inputValue,setSearchQuery])
    
    
    useEffect(() => {
    const handlerPrice = setTimeout(() => {
        setMinPrice(inputMinPrice)
        setMaxPrice(inputMaxPrice)
    },0)
    return () => {
      clearTimeout(handlerPrice)
    }
  },[inputMaxPrice,inputMinPrice,setMinPrice,setMaxPrice])
  
    
    useEffect(() => {
        setPage(1);
    }, [selectedCategory]);

    const handleMinPriceChange = (e) => {
        const value = e.target.value;
        setInputMinPrice(value ? parseFloat(value) : undefined)
    }

    const handleMaxPriceChange = (e) => {
        const value = e.target.value
        setInputMaxPrice(value ? parseFloat(value) : undefined)
    }

    const handleKeywordChange = (keyword: string) => {
        setKeyword(keyword)
    }

    const handleResetFilter = () => {
        setSearchQuery('')
        setSelectedCategory('')
        setMinPrice(undefined)
        setMaxPrice(undefined)
        setKeyword('')
        setSortOrder('default')
        setOrderBy('')
    }

    const categories = ['Smartphone', 'Headphones', 'Shoes', 'Laptop']

    return (
        <div className="w-72 bg-white border-r border-gray-200 h-screen overflow-y-auto">
            <div className="p-6 space-y-6">
                {/* Header */}
              +

                {/* Search Section */}
                <div className="space-y-3">
                    <h2 className="text-base font-semibold text-gray-700">Search</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors text-sm"
                            placeholder="Search products..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                </div>

                {/* Price Range Section */}
                <div className="space-y-3">
                    <h2 className="text-base font-semibold text-gray-700">Price Range</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <input 
                            type="number"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors text-sm"
                            placeholder="Min"
                            value={inputMinPrice ?? ''}
                            onChange={(e)=>setInputMinPrice(e.target.value ? parseFloat(e.target.value) : undefined)
}
                        />
                        <input 
                            type="number"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors text-sm"
                            placeholder="Max"
                            value={inputMaxPrice ?? ''}
                            onChange={(e)=>setInputMaxPrice(e.target.value ? parseFloat(e.target.value) : undefined)
}
                        />
                    </div>
                </div>

                {/* Categories Section */}
                <div className="space-y-3">
                    <h2 className="text-base font-semibold text-gray-700">Categories</h2>
                    <div className="space-y-2">
                        {/* All Categories Option */}
                        
                        
                        {categories.map((category) => (
                            <label key={category} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="category"
                                    value={category}
                                    checked={selectedCategory === category}
                                    onChange={(e) => { setSelectedCategory(selectedCategory === category?'': e.target.value) }}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="ml-3 text-sm text-gray-700">
                                    {category}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Sort Section */}
                <div className="space-y-3">
                    <h2 className="text-base font-semibold text-gray-700">Sort by Price</h2>
                    <div className="space-y-2">
                        <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="checkbox"
                                name="orderBy"
                                value="asc"
                                checked={sortOrder === 'asc'}
                                onChange={(e) => {
                                    setOrderBy('price')
                                    setSortOrder(sortOrder === 'asc' ? 'default' : e.target.value)
                                }}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">
                                Low to High
                            </span>
                        </label>
                        
                        <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="checkbox"
                                name="orderBy"
                                value="desc"
                                checked={sortOrder === 'desc'}
                                onChange={(e) => {
                                    setOrderBy('price')
                                    setSortOrder(sortOrder === 'desc' ? 'default' : e.target.value)
                                }}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">
                                High to Low
                            </span>
                        </label>
                    </div>
                </div>

                {/* Reset Button */}
                <button 
                    onClick={handleResetFilter} 
                    className="w-full py-3 bg-black hover:bg-white hover:text-black text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset Filters
                </button>
            </div>
        </div>
    )
}

export default Sidebar
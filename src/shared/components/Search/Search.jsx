import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../../services/apisearch/apisearch';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import apiurl from '../../services/apiendpoint/apiendpoint';

const toUrlFriendly = (str) => {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const Search = ({ closeSearch, isSearchOpen }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNext: false,
        hasPrev: false
    });
    
    const navigate = useNavigate();
    const searchInputRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    }, [isSearchOpen]);

    const performSearch = useCallback(async (searchQuery, page = 1) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setPagination({
                currentPage: 1,
                totalPages: 0,
                totalCount: 0,
                hasNext: false,
                hasPrev: false
            });
            return;
        }

        setIsLoading(true);
        try {
            const searchParams = {
                query: searchQuery,
                page,
                limit: 4
            };

            const response = await searchProducts(searchParams);
            
            if (response.success) {
                setResults(response.data.products || []);
                setPagination(response.data.pagination || {});
            } else {
                setResults([]);
                setPagination({});
                console.error('Search failed:', response.error);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (value.trim()) {
                performSearch(value);
            }
        }, 500);
    };

    const handleSearch = (searchTerm = query) => {
        if (searchTerm.trim()) {
            performSearch(searchTerm);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleProductClick = (product) => {
        navigate(`/products/${toUrlFriendly(product.Product_type)}/${toUrlFriendly(product.Product_Name)}`, {
            state: { product: product, productId: product._id }
        });
        closeSearch();
    };

    const handlePageChange = (newPage) => {
        if (query.trim()) {
            performSearch(query, newPage);
        }
    };

    const highlightMatch = (text, searchQuery) => {
        if (!searchQuery.trim() || !text) return text;
        
        const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        
        return parts.map((part, index) =>
            regex.test(part) ? (
                <span key={index} className="bg-blue-400 text-blue-900 px-1 rounded">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setPagination({
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            hasNext: false,
            hasPrev: false
        });
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/75 z-[100] flex items-start justify-center pt-16 transition-all duration-500 ease-in-out ${isSearchOpen ? 'opacity-100 visible backdrop-blur-lg' : 'opacity-0 invisible'}`}>
            <div className={`w-full max-w-6xl px-6 transform transition-all duration-500 ease-out ${isSearchOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}>
                
                <button onClick={closeSearch} className="absolute top-8 right-8 text-white hover:text-red-400 transition-colors z-10 group">
                    <svg className="w-8 h-8 transform group-hover:-rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-white text-3xl md:text-4xl font-light mb-2 tracking-wide">
                        Discover Products
                    </h2>
                    <p className="text-gray-400">
                        Search through our premium collection
                    </p>
                </div>

                <div className="relative mb-6">
                    <div className="relative">
                        <input ref={searchInputRef} type="text" value={query} onChange={handleInputChange}
                            onKeyPress={handleKeyPress} placeholder="Search products, brands, categories..."
                            className="w-full bg-white backdrop-blur-md text-black text-xl font-light border-b-2 border-gray-600 focus:border-white  outline-none py-4 px-6 pr-16 placeholder-gray-400 transition-all duration-300"
                        />
                        {query.trim() && (
                            <button onClick={clearSearch} className="absolute cursor-pointer right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors">
                               <X/>
                            </button>
                        )}
                        <button onClick={() => handleSearch()}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400  transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {pagination.totalCount > 0 && (
                    <div className="text-gray-400 text-sm mb-4">
                        {pagination.totalCount} results found
                        {query && ` for "${query}"`}
                    </div>
                )}

                <div className="max-h-[50vh] custom-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '0.75s' }}></div>
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {results.map(product => {
                                    const variant = product.variants?.[0];
                                    const imagePath = variant?.variant_images?.[0];
                                    const imageUrl = `${apiurl()}/${imagePath}`;
                                    
                                    return (
                                        <div key={product._id} onClick={() => handleProductClick(product)}
                                            className="bg-gray-500 backdrop-blur-md p-4 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-2xl"
                                        >
                                            <div className="flex space-x-4">
                                                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 overflow-hidden relative">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt={product.Product_Name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading='lazy'/>
                                                    ) : null}
                                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center" style={{ display: imageUrl ? 'none' : 'flex' }}>
                                                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                   
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-300 transition-colors line-clamp-2">
                                                        {highlightMatch(product.Product_Name, query)}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="text-gray-300 text-sm bg-white/10 px-2 py-1 ">
                                                            {product.Product_type}
                                                        </span>
                                                        <span className="text-gray-400 text-sm">•</span>
                                                        <span className="text-gray-300 text-sm">
                                                            {product.gender}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center space-x-4 mt-6">
                                    <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrev}
                                        className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                       <ArrowLeft/>
                                    </button>
                                    
                                    <div className="flex items-center space-x-2">
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            const pageNum = i + 1;
                                            const isCurrentPage = pageNum === pagination.currentPage;
                                            
                                            return (
                                                <button key={pageNum} onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10  transition-colors ${isCurrentPage ? 'bg-gray-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNext}
                                        className="px-4 py-2 bg-white/10 text-white  hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        <ArrowRight/>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : query.trim() && !isLoading ? (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <svg className="w-16 h-16 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-xl mb-2">No products found</p>
                            <p className="text-gray-500 mb-6">Try adjusting your search terms</p>
                            <button onClick={() => {setQuery('');setResults([]);searchInputRef.current?.focus();}} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 transition-colors">
                                Clear Search
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Search;
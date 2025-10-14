import { X } from 'lucide-react';

export default function FilterSidebar({
    setIsOpen, 
    isOpen, 
    selectedSizes, 
    selectedColors,
    selectedProductTypes,
    priceRange,
    minPrice,
    maxPrice,
    availableSizes, 
    availableColors,
    availableProductTypes,
    handleSizeChange, 
    handleColorChange,
    handlePriceRangeChange,
    handleProductTypeChange,
    clearFilters
}) {
    const activeFiltersCount = selectedSizes.length + selectedColors.length + selectedProductTypes.length + 
        (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0);

    return (
        <>
            <div className={`fixed top-0 right-0 h-full w-full md:w-[50%] lg:w-[45%] xl:w-[25%] bg-zinc-800 z-[100] text-white p-5 transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <X onClick={() => setIsOpen(!isOpen)} className="cursor-pointer"/>
                </div>
               
                {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="mb-4 px-3 py-1 bg-red-600 text-white text-sm rounded cursor-pointer hover:bg-red-700 w-full">
                        Clear All Filters ({activeFiltersCount} active)
                    </button>
                )}

                <div className="mb-6 bg-gray-700 p-4 rounded">
                    <h3 className="font-semibold mb-3"> Price</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span>₹{priceRange[0]}</span>
                            <span>₹{priceRange[1]}</span>
                        </div>
                        
                        <div className="relative pt-1">
                            <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={priceRange[0]}
                                onChange={(e) => {
                                    const newMin = Math.min(Number(e.target.value), priceRange[1] - 100);
                                    handlePriceRangeChange([newMin, priceRange[1]]);
                                }}
                                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-20"
                                style={{
                                    background: 'transparent'
                                }}
                            />
                            <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={priceRange[1]}
                                onChange={(e) => {
                                    const newMax = Math.max(Number(e.target.value), priceRange[0] + 100);
                                    handlePriceRangeChange([priceRange[0], newMax]);
                                }}
                                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-20"
                                style={{
                                    background: 'transparent'
                                }}
                            />
                            <div className="relative w-full h-2 bg-gray-500 rounded">
                                <div 
                                    className="absolute h-2 bg-blue-500 rounded"
                                    style={{
                                        left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                                        right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {availableProductTypes.length > 0 && (
                    <div className="mb-6 bg-gray-700 p-2 rounded">
                        <h3 className="font-semibold mb-3">Product Type</h3>
                        <div className="space-y-2">
                            {availableProductTypes.map(type => (
                                <label key={type} className="flex items-center cursor-pointer hover:bg-zinc-700 p-2 rounded">
                                    <input 
                                        type="checkbox" 
                                        className="mr-3" 
                                        checked={selectedProductTypes.includes(type)} 
                                        onChange={() => handleProductTypeChange(type)}
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
               
                {availableSizes.length > 0 && (
                    <div className="mb-6 bg-gray-700 p-2 rounded">
                        <h3 className="font-semibold mb-3">Size</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            {availableSizes.map(size => (
                                <label key={size} className="flex items-center cursor-pointer hover:bg-zinc-700 p-2 rounded">
                                    <input type="checkbox" className="mr-3" checked={selectedSizes.includes(size)} onChange={() => handleSizeChange(size)}/>
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {availableColors.length > 0 && (
                    <div className="mb-6 bg-gray-700 p-2 rounded">
                        <h3 className="font-semibold mb-3">Color</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            {availableColors.map(color => (
                                <label key={color.name} className="flex items-center cursor-pointer hover:bg-zinc-700 p-2 rounded">
                                    <input type="checkbox" className="mr-3" checked={selectedColors.includes(color.name)} onChange={() => handleColorChange(color.name)}/>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded border border-gray-400" style={{ backgroundColor: color.code }}></div>
                                        <span>{color.name}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                input[type="range"] {
                    -webkit-appearance: none;
                    pointer-events: all;
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    pointer-events: all;
                    border: 2px solid #3b82f6;
                }
                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    pointer-events: all;
                    border: 2px solid #3b82f6;
                }
            `}</style>
        </>
    );
}
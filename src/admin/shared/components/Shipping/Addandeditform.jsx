import { Dialog } from "primereact/dialog";

export default function AddandEditform ({visible, setVisible, formdata, handlesave, handleupdate, handlechange, loading}) {

    return (
        <>
            <Dialog header="Shipping amount calculations" visible={visible} onHide={() => setVisible(false)} className="!w-full lg:!w-[40rem]">
                 <form onSubmit={!formdata?._id ? handlesave : handleupdate}>
                    <div className="mb-4">
                        <div className="mb-2">
                            <label className="font-medium">Shipping Type</label>
                        </div>
                        <select 
                            name="Shipping_Type" 
                            value={formdata?.Shipping_Type || 'standard'} 
                            onChange={handlechange} 
                            className="w-full px-4 py-2 border rounded-md outline-none"
                            required
                        >
                            <option value="standard">Standard Amount</option>
                            <option value="flat">Flat Rate</option>
                            <option value="percentage">Percentage</option>
                            <option value="free">Free Shipping</option>
                        </select>
                    </div>

                    {formdata?.Shipping_Type !== 'free' && (
                        <div className="mb-4">
                            <div className="mb-2">
                                <label className="font-medium">
                                    {formdata?.Shipping_Type === 'percentage' ? 'Percentage (%)' : 'Amount'}
                                </label>
                            </div>
                            <div className="relative">
                                {formdata?.Shipping_Type === 'percentage' && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                )}
                                <input 
                                    type="number" 
                                    name="Shipping_Amount" 
                                    value={formdata?.Shipping_Amount || ''} 
                                    onChange={handlechange} 
                                    className="w-full px-4 py-2 border rounded-md outline-none" 
                                    placeholder={formdata?.Shipping_Type === 'percentage' ? 'Enter percentage (e.g., 20)' : 'Enter amount'}
                                    min="0"
                                    step={formdata?.Shipping_Type === 'percentage' ? '0.01' : '0.01'}
                                    max={formdata?.Shipping_Type === 'percentage' ? '100' : undefined}
                                    required 
                                />
                            </div>
                        </div>
                    )}

                    {/* Minimum Order Amount for Free Shipping (Optional) */}
                    {formdata?.Shipping_Type === 'free' && (
                        <div className="mb-4">
                            <div className="mb-2">
                                <label className="font-medium">Minimum Order Amount (Optional)</label>
                            </div>
                            <input 
                                type="number" 
                                name="Min_Order_Amount" 
                                value={formdata?.Min_Order_Amount || ''} 
                                onChange={handlechange} 
                                className="w-full px-4 py-2 border rounded-md outline-none" 
                                placeholder="Leave empty for always free"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    )}

                    {/* Description/Note */}
                    <div className="mb-4">
                        <div className="mb-2">
                            <label className="font-medium">Description (Optional)</label>
                        </div>
                        <textarea 
                            name="Description" 
                            value={formdata?.Description || ''} 
                            onChange={handlechange} 
                            className="w-full px-4 py-2 border rounded-md outline-none resize-none" 
                            rows="2"
                            placeholder="Add shipping description..."
                        />
                    </div>

                    {/* Example Calculation Display */}
                    {formdata?.Shipping_Type === 'percentage' && formdata?.Shipping_Amount && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                                <strong>Example:</strong> For an order of ₹2000, shipping will be ₹{((2000 * formdata.Shipping_Amount) / 100).toFixed(2)}
                            </p>
                        </div>
                    )}

                    {formdata?.Shipping_Type === 'flat' && formdata?.Shipping_Amount && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                                <strong>Flat Rate:</strong> ₹{parseFloat(formdata.Shipping_Amount).toFixed(2)} will be charged for all orders
                            </p>
                        </div>
                    )}

                    <div className="mb-2">
                        <button type="submit" className="w-full px-4 py-2 text-white border rounded-md bg-black hover:bg-gray-800 transition-colors" disabled={loading}>
                            {loading && (
                                <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full mr-2" role="status" aria-label="loading"></span>
                            )} 
                            {!formdata?._id ? "Save" : "Update"}
                        </button>
                    </div>
                 </form>
            </Dialog>
        </>
    )
}
import { Dialog } from "primereact/dialog";

export default function Addandeditform ({ visible, setVisible, formdata, handlechange, handlesave, handleupdate, activeTab  }) {

    const getFieldLabel = (fieldKey) => {
        const labels = {
            // 'Category': 'Category',
            // 'Subcategory': 'Subcategory', 
            'tags': 'Tags',
            'sizes': 'Sizes',
            'gender': 'Gender',
            'Product_type': 'Product Type',
            'Color': 'Color',
            // 'Header_menu': 'Header Menu'
        };
        return labels[fieldKey] || fieldKey;
    };

    const getFieldValue = (fieldKey) => {
        return formdata[fieldKey] || '';
    };

    const renderColorFields = () => {
        if (activeTab !== 'Color') return null;

        return (
            <>
               

                <div>
                    <label className="block text-gray-800 mb-2 font-medium">Color Code</label>
                    <div className="flex gap-3 items-center">
                        <input type="color" name="color_code"  value={formdata.color_code || '#000000'}  className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer" 
                            onChange={handlechange} required />
                        <input type="text" name="color_code" value={formdata.color_code || ''} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" 
                            onChange={handlechange} placeholder="#000000" pattern="^#[0-9A-Fa-f]{6}$" required/>
                    </div>
                    <small className="text-gray-600">Pick a color or enter hex code</small>
                </div>
            </>
        );
    };

    // const renderHeaderMenuFields = () => {
    //     if (activeTab !== 'Header_menu') return null;

    //     return (
    //         <>
    //             <div>
    //                 <label className="block text-gray-800 mb-2 font-medium">Main Title</label>
    //                 <input 
    //                     type="text" 
    //                     name="main_title" 
    //                     value={formdata.main_title || ''} 
    //                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" 
    //                     onChange={handlechange}
    //                     placeholder="Enter main header title (e.g., Collection)"
    //                     required
    //                 />
    //             </div>

    //             <div>
    //                 <label className="block text-gray-800 mb-2 font-medium">Subtitle</label>
    //                 <input 
    //                     type="text" 
    //                     name="subtitle" 
    //                     value={formdata.subtitle || ''} 
    //                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" 
    //                     onChange={handlechange}
    //                     placeholder="Enter subtitle (e.g., COLLECTIONS, TOPS, BOTTOMS)"
    //                     required
    //                 />
    //             </div>

    //             <div>
    //                 <label className="block text-gray-800 mb-2 font-medium">Collection Names</label>
    //                 <textarea 
    //                     name="collection_names" 
    //                     value={formdata.collection_names || ''} 
    //                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" 
    //                     onChange={handlechange}
    //                     placeholder="Enter collection names separated by commas (e.g., Extreme Light Cotton, Extreme Softstyle, T-Shirts & Tanks)"
    //                     rows="4"
    //                     required
    //                 />
    //                 <small className="text-gray-600">Separate multiple collections with commas</small>
    //             </div>
    //         </>
    //     );
    // }

    const renderRegularField = () => {
        if (activeTab === 'Header_menu') return null;

        return (
            <div>
                <label className="block text-gray-800 mb-2 font-medium">
                    {getFieldLabel(activeTab)}
                </label>
                <input type="text" name={activeTab} value={getFieldValue(activeTab)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" 
                    onChange={handlechange} placeholder={`Enter ${getFieldLabel(activeTab).toLowerCase()}`} required />
            </div>
        );
    };

    return (
        <>
         <Dialog header="Hookups Form" visible={visible} onHide={() => { if (!visible) return; setVisible(false); }} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} 
                maximizable
            >
                <form onSubmit={!formdata._id ? handlesave : handleupdate}>
                    <div className="space-y-5">
                        
                        {renderRegularField()}
                        {/* {renderHeaderMenuFields()} */}
                        {renderColorFields()}

                        <div>
                            <label className="block text-gray-800 mb-2 font-medium">Status</label>
                            <select name="Status" value={formdata.Status || ''} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" 
                                onChange={handlechange} required >
                                <option value="">---Select Status---</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button type="button" className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors" onClick={() => setVisible(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="px-8 py-3 text-white bg-black hover:bg-gray-800 transition-colors">
                            {!formdata._id ? 'Save' : 'Update'}
                        </button>
                    </div>
                </form>
            </Dialog>
        </>
    )
}
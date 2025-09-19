import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from 'primereact/multiselect';

export default function Addandeditform ({ visible, setVisible, file, productname, handlesave, handlechange, loading, formdata, handleupdate }) {

    const productOptions = productname && Array.isArray(productname) ? productname.map((name) => ({ label: name, value: name })): [];
    
    const highlightedProductOptions = formdata?.productname && Array.isArray(formdata?.productname) 
        ? formdata.productname.map((name) => ({ label: name, value: name }))
        : [];
    
    const handleMultiSelectChange = (e) => {
        console.log("MultiSelect change event:", e);
        const event = {
            target: {
                name: 'productname',
                value: e.value
            }
        };
        
        if (formdata?.highlightedProduct && !e.value.includes(formdata.highlightedProduct)) {
            const highlightedEvent = {
                target: {
                    name: 'highlightedProduct',
                    value: ''
                }
            };
            handlechange(highlightedEvent);
        }
        
        handlechange(event);
    };

    const handleHighlightedProductChange = (e) => {
        const event = {
            target: {
                name: 'highlightedProduct',
                value: e.value
            }
        };
        handlechange(event);
    };

    return (
        <>
        <Dialog header="Popular Products Details" visible={visible} onHide={() => setVisible(false)} className="!w-full lg:!w-[40rem]">
            <form onSubmit={!formdata?._id ? handlesave : handleupdate}>
                <div className='grid grid-cols-1 gap-3 lg:grid-cols-1'>
                     <div className="mb-2">
                        <div className="mb-2">
                            <label>Product Name</label>
                        </div>
                        <MultiSelect name="productname" value={formdata?.productname || []} options={productOptions} onChange={handleMultiSelectChange} placeholder="Select Product Names" 
                            className="w-full" display="chip" required emptyMessage="No products available" showSelectAll={true} filter={true} filterBy="label"
                        />
                    </div>

                     {formdata?.productname && formdata?.productname.length > 0 && (
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Highlighted Product</label>
                            </div>
                            <Dropdown
                                name="highlightedProduct"
                                value={formdata?.highlightedProduct || ''}
                                options={highlightedProductOptions}
                                onChange={handleHighlightedProductChange}
                                placeholder="Select a highlighted product"
                                className="w-full"
                                emptyMessage="No products selected"
                                showClear={true}
                            />
                        </div>
                    )}
                    <div className="mb-2">
                        <div className="mb-2">
                            <label>Status</label>
                        </div>
                        <select name="Status" value={formdata?.Status || ''} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required>
                            <option value="" disabled>---Select a status---</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="mb-2">
                    <button type="submit" className="w-full px-4 py-2 text-white border bg-black">
                        {loading && (
                            <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status"
                                aria-label="loading"
                            ></span>
                        )}{' '}
                        {!formdata?._id ? 'Save' : 'Update'}
                    </button>
                </div>
            </form>
        </Dialog>
        </>
    )
}